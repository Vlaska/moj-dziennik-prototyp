interface GradeType {
    name: string,
    weight: number
}

class Course {
    name: string;
    grades: GradeType[];
    constructor(name: string, grades: Array<GradeType>) {
        this.name = name;
        this.grades = grades;
    }
}

let courses = [
    new Course('Język Polski',
        [{
            name: "Sprawdzian",
            weight: 80
        },
        {
            name: "Kartkówka",
            weight: 30
        },
        {
            name: "Odpowiedź ustna",
            weight: 50
        },
        {
            name: "Praca domowa",
            weight: 40
        }
        ]),
    new Course(
        'Informatyka',
        [{
            name: "Sprawdzian",
            weight: 80
        },
        {
            name: "Kartkówka",
            weight: 30
        },
        {
            name: "Odpowiedź ustna",
            weight: 50
        },
        {
            name: "Praca domowa",
            weight: 40
        }
        ]
    )
]

let selected_course: number = -1;
let selected_grade_type: number = -1;


function select_grade_type(val: number) {
    selected_grade_type = val;
    let slider_input = $('#type-weight');
    let slider_result = $('#weight-result');
    let name_input = $('#type-name');

    if (val == -1) {
        slider_input.val(100);
        slider_result.text('100');
        name_input.val('');
    } else {
        slider_input.prop('disabled', false);
        name_input.prop('disabled', false);

        let grade = courses[selected_course].grades[val];
        slider_input.val(grade.weight);
        slider_result.text(grade.weight);
        name_input.val(grade.name);
    }
}


function create_type_selector_options(dst: JQuery<HTMLSelectElement>, idx: number) {
    dst.empty();
    dst.append($(document.createElement('option')).val(-1).prop('selected', true).prop('hidden', true).text('---'));
    let types = courses[idx].grades;
    for (let i = 0; i < types.length; ++i) {
        dst.append($(document.createElement('option')).val(i).text((types[i] as any).name));
    }
    $('#type-name').removeClass('is-invalid')
    $('#name-repeated-edit').css('display', 'none');

}


function validate_name(new_name: string, old_name?: string): boolean {
    if (old_name) {
        if (new_name == old_name) return true;
        if (courses[selected_course].grades.find(e => { return e.name == new_name }) === undefined) return true;
        return false;
    } else {
        if (courses[selected_course].grades.find(e => { return e.name == new_name }) === undefined) return true;
        return false;
    }
}


function show_alert(dst: JQuery<HTMLDivElement>, message: string, type: string = 'alert-success') {
    dst.html(
        `
        <div class="alert ${type} alert-dismissible fade show" role="alert" id="main-alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `
    );
    setTimeout(() => {
        ($('#main-alert') as any).alert('close');
    }, 5000);
}


$(() => {
    let slider_input = $('#type-weight');
    let slider_result = $('#weight-result');
    let name_input = $('#type-name');
    let save_btn = $('#save-changes-button');

    slider_input.on('input', () => {
        slider_result.text(slider_input.val() as string);
    });
    slider_result.text(slider_input.val() as string);

    let type_select = $('#type-select') as JQuery<HTMLSelectElement>;
    let course_name_input = $('#course-type');

    function reset_rest_fields() {
        slider_input.prop('disabled', true);
        name_input.prop('disabled', true);
    }

    course_name_input.on('change', () => {
        let val = course_name_input.val() as number;
        console.log(val);
        if (val != -1) {
            type_select.prop('disabled', false);
            selected_course = val;
            create_type_selector_options(type_select, val);
            reset_rest_fields();
            select_grade_type(-1);
        }
    });

    type_select.on('change', () => {
        let val = parseInt(type_select.val() as string);
        if (val != -1) {
            // selected_grade_type = val;
            // slider_input.prop('disabled', false);
            // name_input.prop('disabled', false);
            name_input.removeClass('is-invalid')
            $('#name-repeated-edit').css('display', 'none');
            select_grade_type(val);
        }
    });

    save_btn.on('click', () => {
        if (selected_course === -1) {
            show_alert($('#alert-container'), 'Aby móc zapisać zmiany, należy wybrać przedmiot oraz rodzaj oceny.', 'alert-danger');
            return;
        }
        if (selected_grade_type === -1) {
            show_alert($('#alert-container'), 'Aby móc zapisać zmiany, należy wybrać rodzaj oceny.', 'alert-danger');
            return;
        }
        let grade_type = courses[selected_course].grades[selected_grade_type];
        let new_name = name_input.val() as string;
        if (new_name == '') {
            $('#name-empty-edit').css('display', 'block');
            $('#name-repeated-edit').css('display', 'none');
            name_input.addClass('is-invalid')
            return;
        }
        if (!validate_name(new_name, grade_type.name)) {
            $('#name-empty-edit').css('display', 'none');
            $('#name-repeated-edit').css('display', 'block');
            name_input.addClass('is-invalid')
            return;
        }
        name_input.removeClass('is-invalid')
        $('#name-empty-edit').css('display', 'none');
        $('#name-repeated-edit').css('display', 'none');
        grade_type.name = new_name;
        $(`#type-select>option[value=${selected_grade_type}]`).text(new_name);
        grade_type.weight = parseInt(slider_input.val() as string);
        show_alert($('#alert-container'), "Zapisano zmiany");
    });
});

$(() => {
    let new_def_btn = $('#add-new-def');
    let new_modal = $('#new-grade-def-modal');
    let save_btn = $('#new-grade-def-modal-save');
    let name_input = $('#new-type-name');
    let slider_input: JQuery<HTMLInputElement> = $('#new-type-weight');
    let slider_result = $('#new-weight-result');

    slider_input.on('input', () => {
        slider_result.text(slider_input.val() as string);
    });
    slider_result.text(slider_input.val() as string);

    save_btn.on('click', () => {
        let new_name = name_input.val() as string;
        let weight = parseInt(slider_input.val() as string);
        if (new_name == '') {
            $('#new-name-empty-edit').css('display', 'block');
            $('#new-name-repeated-edit').css('display', 'none');
            name_input.addClass('is-invalid')
            return;
        }
        if (!validate_name(new_name)) {
            $('#new-name-empty-edit').css('display', 'none');
            $('#new-name-repeated-edit').css('display', 'block');
            name_input.addClass('is-invalid')
            return;
        }
        $('#new-name-empty-edit').css('display', 'none');
        $('#new-name-repeated-edit').css('display', 'none');
        name_input.removeClass('is-invalid')
        let new_grade: GradeType = {
            name: new_name,
            weight: weight
        };
        let idx = courses[selected_course].grades.length;
        courses[selected_course].grades.push(new_grade);
        ($('#type-select') as JQuery<HTMLSelectElement>).append($(document.createElement('option')).val(idx).text(new_name).prop('selected', true));
        select_grade_type(idx);
        
        (new_modal as any).modal('hide');
    });
    
    new_def_btn.on('click', () => {
        if (selected_course === -1) {
            show_alert($('#alert-container'), 'Aby dodać nową definicję oceny, należy wybrać przedmiot.', 'alert-danger');
            return;
        }
        $('#new-name-empty-edit').css('display', 'none');
        $('#new-name-repeated-edit').css('display', 'none');
        name_input.removeClass('is-invalid')
        name_input.val('');
        slider_input.val(100);
        slider_result.text('100');
        $('#new-name-repeated-edit').css('display', 'none');
        (new_modal as any).modal('show');
    });
});