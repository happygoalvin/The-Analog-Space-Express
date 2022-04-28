// import in caolan forms
const forms = require("forms");
const {
    Types
} = require("mysql");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createCameraForm = (types, classifications, manufacturers, films) => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.text(),
        }),
        type_id: fields.string({
            label: 'Type',
            required: true,
            errorAfterField: true,
            widget: widgets.select({
                classes: ['form-select']
            }),
            choices: types,
        }),
        manufacturer_id: fields.string({
            label: 'Manufacturer',
            required: true,
            errorAfterField: true,
            widget: widgets.select({
                classes: ['form-select']
            }),
            choices: manufacturers,
        }),
        created_date: fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date(),
            validators: [validators.date()]
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.textarea(),
        }),
        stock: fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        }),
        camera_ISO: fields.string({
            required: false,
            errorAfterField: true,
        }),
        shutter_speed: fields.string({
            required: false,
            errorAfterField: true
        }),
        aperture: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.alphanumeric()]
        }),
        focal_length: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.alphanumeric()]
        }),
        flash: fields.string({
            required: false,
            errorAfterField: true
        }),
        battery: fields.string({
            required: false,
            errorAfterField: true
        }),
        body_color: fields.string({
            required: false,
            errorAfterField: true
        }),
        format: fields.string({
            required: false,
            errorAfterField: true,
            validators: [validators.alphanumeric()]
        }),
        weight: fields.number({
            required: false,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        }),
        classifications: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: classifications
        }),
        films: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: films
        })
    })
}

module.exports = {
    createCameraForm,
    bootstrapField
}