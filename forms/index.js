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

const createCameraForm = (types, classifications) => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.text()
        }),
        created_date: fields.date({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.textarea()
        }),
        stock: fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.number()
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.number()
        }),
        camera_iso: fields.number({
            required: false,
            errorAfterField: false,
            widget: widgets.number()
        }),
        shutter_speed: fields.string({
            required: false,
            errorAfterField: false,
        }),
        aperture: fields.string({
            required: false,
            errorAfterField: false
        }),
        focal_length: fields.string({
            required: false,
            errorAfterField: false
        }),
        flash: fields.string({
            required: false,
            errorAfterField: false
        }),
        battery: fields.string({
            required: false,
            errorAfterField: false
        }),
        body_color: fields.string({
            required: false,
            errorAfterField: false
        }),
        format: fields.string({
            required: false,
            errorAfterField: false
        }),
        weight: fields.number({
            required: false,
            errorAfterField: false,
            widget: widgets.number()
        }),
        type_id: fields.string({
            label: 'Type',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: types
        }),
        classifications: fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: classifications
        })
    })
}

module.exports = {
    createCameraForm,
    bootstrapField
}