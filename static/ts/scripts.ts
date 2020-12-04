

function init_grades() {
    let grade_container = $('#grades-buttons');
    let to_init = grade_container.children();
    for (let i = 0; i < to_init.length; ++i) {

        $(to_init[i]).on("click", () => {
            set_grade($(to_init[i]));
        });
    }
    $('#selected-grade').on('click', reset_selected_grade);
    let rows = ($('#grade-table').get()[0] as HTMLTableElement).rows;
    for (let i = 1; i < rows.length; ++i) {
        let cells = rows[i].cells;
        for (let j = 1; j < cells.length; ++j) {
            // console.log(cells[j]);
            $(cells[j]).on('click', () => {
                operation_on_cell($(cells[j]));
            });
            cells[j].setAttribute('role', 'button');
        }
    }
}


function reset_selected_grade() {
    let selected_container = $('#selected-grade');

    if (selected_container.html() === "<i class=\"fas fa-mouse-pointer\"></i>") {
        return;
    }

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

function operation_on_cell(src: JQuery<HTMLTableCellElement>) {
    let grade = $('#selected-grade');
    
    if (grade.data('pointer')) {

    } else if (grade.data('trash')) {
        src.text('');
    } else {
        src.text(grade.data('selected'));
    }
    // console.log(grade.data('selected'));
    // src.text()
}
