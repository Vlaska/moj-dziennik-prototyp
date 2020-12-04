let grades = {
    columns: [
        ['Odpowiedż ustna 1', 'oust', ['3', '5', '+3', '+4', '3', '5', '+3'], ''],
        ['Odpowiedż ustna 2', 'oust', [null, '4', null, null, '+2', '5', null], ''],
        ['Odpowiedż ustna 3', 'oust', [null, '=5', null, null, null, null, null], ''],
        ['Sprawdzian 1', 'spr', ['2', '5', '3', '0', '1', '5', '5'], ''],
        ['Sprawdzian 2', 'spr', ['5', '-4', '3', '4', '=2', '5', '4'], ''],
    ],
    names: [
        'Marika Jasina',
        'Damian Kolka',
        'Gaja Lampa',
        'Fabian Rosołek',
        'Adrian Torbus',
        'Iwo Wojczuk',
        'Robert Zięciak',
    ],
}

const MAX_COL = 12;


interface GradeType {
    name: string,
    weight: number
};

let grade_types: Record<string, GradeType> = {
    spr: {
        name: "Sprawdzian",
        weight: 80
    },
    kar: {
        name: "Kartkówka",
        weight: 30
    },
    oust: {
        name: "Odpowiedź ustna",
        weight: 50
    },
    pdom: {
        name: "Praca domowa",
        weight: 40
    }
}

let used_grade_idxes: Record<string, number> = {
    spr: 2,
    kar: 0,
    oust: 3,
    pdom: 0
}


function get_rows(): HTMLCollectionOf<HTMLTableRowElement> {
    return ($('#grade-table').get()[0] as HTMLTableElement).rows;
}

function init_grades() {
    let grade_container = $('#grades-buttons');
    let to_init = grade_container.children();
    for (let i = 0; i < to_init.length; ++i) {

        $(to_init[i]).on("click", () => {
            set_grade($(to_init[i]));
        });
    }
    $('#selected-grade').on('click', reset_selected_grade);
    let grade_type_select = $('#grade-type');
    for (let i in grade_types) {
        let option = document.createElement('option');
        $(option).attr('value', i).text(grade_types[i].name);
        grade_type_select.append(option);
    }
    // let rows = get_rows();
    // for (let i = 1; i < rows.length; ++i) {
    //     let cells = rows[i].cells;
    //     for (let j = 1; j < cells.length; ++j) {
    //         $(cells[j]).on('click', () => {
    //             operation_on_cell($(cells[j]));
    //         });
    //         cells[j].setAttribute('role', 'button');
    //     }
    // }
}


function reset_selected_grade() {
    let selected_container = $('#selected-grade');

    if (selected_container.html() === "<i class=\"fas fa-mouse-pointer\"></i>") {
        return;
    }

    selected_container.data('pointer', true);
    if (selected_container.data('trash')) {
        selected_container.removeClass('trash');
        selected_container.data('trash', false);
    }

    selected_container.html("<i class=\"fas fa-mouse-pointer\"></i>");
    let t = $('.grade-select-menu-item.selected');
    if (t) {
        t.removeClass('selected');
    }
    $('#empty-grade').addClass('selected');
}

function set_grade(src: JQuery<HTMLElement>) {
    let selection = $('#selected-grade');

    if (selection.data('trash') == true) {
        console.log(src.data('trash'))
        if (src.data('trash') == false || src.data('trash') == undefined) {
            selection.removeClass('trash');
            selection.data('trash', false)
            selection.data('selected', src.data('selected'))
            selection.text(src.data('selected'));

            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
            src.addClass('selected');
        }
    } else {
        if (src.data('trash') == true) {
            selection.addClass('trash');
            selection.data('trash', true)
            selection.data('selected', '')

            selection.html('<i class="far fa-trash-alt">');

            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
        } else {
            selection.data('selected', src.data('selected'))
            selection.html(src.data('selected'));
            let t = $('.grade-select-menu-item.selected');
            if (t) {
                t.removeClass('selected');
            }
            src.addClass('selected');
        }
    }
    if (src.data('pointer')) {
        selection.data('pointer', true);
    } else {
        selection.data('pointer', false);
    }
}


function table_header_generator() {
    let row = document.createElement('tr');
    $(row).addClass('row');
    let idx = 1;
    row.appendChild(document.createElement('th'));
    for (; idx - 1 < grades["columns"].length; ++idx) {
        let cell = document.createElement('th');
        cell.setAttribute('role', 'button');
        $(cell).text(grades["columns"][idx - 1][0] as any);
        row.appendChild(cell);
    }
    for (; idx <= MAX_COL; ++idx) {
        let cell = document.createElement('th');
        cell.setAttribute('role', 'button');
        $(cell).addClass("empty").html('<i class="fas fa-plus"></i>').on('click', () => create_new_column());
        row.appendChild(cell);
    }
    return row;
}


function table_row_generator(idx: number) {
    let row = document.createElement('tr');
    $(row).addClass('row');
    let name_cell = document.createElement('td');
    $(name_cell).text(grades["names"][idx]);
    row.appendChild(name_cell);
    for (let i = 0; i < grades["columns"].length; ++i) {
        let grade = grades["columns"][i][2][idx];
        let cell = document.createElement('td');
        cell.setAttribute('role', 'button');
        row.appendChild(cell);
        $(cell).on('click', () => {
            operation_on_cell($(cell));
        });
        if (grade == null) {
            continue;
        }
        $(cell).text(grade);
    }
    for (let i = grades.columns.length; i < MAX_COL; ++i) {
        let cell = document.createElement('td');
        cell.setAttribute('role', 'button');
        $(cell).on('click', () => {
            operation_on_cell($(cell));
        });
        row.appendChild(cell);
    }
    return row;
}


function create_table() {
    let prev_table = $('#grade-table');
    if (prev_table) {
        prev_table.remove();
    }

    let tab = document.createElement("table");
    $(tab).addClass('grade-table').attr('id', 'grade-table');
    tab.appendChild(table_header_generator());
    $("#table-container").append(tab);

    for (let i = 0; i < grades['names'].length; ++i) {
        tab.appendChild(table_row_generator(i));
    }
}


function finalize_creation_of_new_column(callback?: () => void) {
    let name = ($("#grade-name") as JQuery<HTMLInputElement>).val() as string;
    let typeVal = ($("#grade-type") as JQuery<HTMLSelectElement>).val() as string;
    let desc = ($("#grade-desc") as JQuery<HTMLTextAreaElement>).val() as string;

    if (typeVal == "") {
        // add info, that this field is required
        return;
    }

    if (!name) {
        let idx = ++used_grade_idxes[typeVal];
        name = `${grade_types[typeVal].name} ${idx}`;
        // ($("#grade-name") as JQuery<HTMLInputElement>).val(name);
    }

    let col_grades = [];
    for (let i = 0; i < grades.names.length; ++i) {
        col_grades.push(null)
    }

    let col = [name, typeVal, col_grades, desc];
    grades.columns.push(col);
    grades.columns.sort((a, b) => {
        if (a[0] == b[0]) return 0;
        return a[0] < b[0] ? -1 : 1;
    });
    if (callback) {
        callback();
    }

    create_table();

    ($('#new-column-modal') as any).modal('hide')
}

let already_inserted_new_column = false;

function create_new_column(callback?: () => void) {
    ($("#grade-name") as JQuery<HTMLInputElement>).val('');
    ($("#grade-type") as JQuery<HTMLSelectElement>).val(0);
    ($("#grade-desc") as JQuery<HTMLTextAreaElement>).val('');
    let modal: any = $('#new-column-modal');
    modal.modal('show');
    already_inserted_new_column = false;
    $("#col-done").on('click', (e) => {
        if (already_inserted_new_column) {
            return;
        }
        already_inserted_new_column = true;
        finalize_creation_of_new_column(callback);
    });
}


function operation_on_cell(src: JQuery<HTMLTableCellElement>) {
    let grade = $('#selected-grade');
    let col_idx = src.get()[0].cellIndex;
    let row_idx = (src.get()[0].parentElement as HTMLTableRowElement).rowIndex;
    let rows = get_rows();

    if (grade.data('pointer')) {

    } else if (grade.data('trash')) {
        src.text('');
    } else {
        let header = $(rows[0].cells[col_idx]);
        if (header.hasClass('empty')) {
            // add prompt asking, if it wants to create new column
            // add new column cration
            return;
        }
        src.text(grade.data('selected'));
    }
    // console.log(grade.data('selected'));
    // src.text()
}
