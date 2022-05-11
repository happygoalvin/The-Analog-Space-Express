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
            validators: [validators.integer(), validators.min(0)]
        }),
        cost: fields.number({
            required: true,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer(), validators.min(0)]
        }),
        camera_iso: fields.string({
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
            validators: [validators.integer(), validators.min(0)]
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
        }),
        image_url: fields.string({
            widget: widgets.hidden()
        })
    })
}

const registrationForm = () => {
    return forms.create({
        first_name: fields.string({
            required: true,
            errorAfterField: true
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true
        }),
        email: fields.email({
            required: true,
            errorAfterField: true,
            widget: widgets.email(),
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.minlength(0), validators.maxlength(16)]
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators: [validators.matchField('password')]
        })
    })
}

const loginForm = () => {
    return forms.create({
        email: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.email()]
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.minlength(0), validators.maxlength(16)]
        })
    })
}

const searchForm = (types, manufacturers, films) => {
    return forms.create({
        type_id: fields.string({
            label: "Type",
            required: false,
            errorAfterField: true,
            widget: widgets.select({
                classes: ['form-select']
            }),
            choices: types
        }),
        manufacturer_id: fields.string({
            label: "Manufacturer",
            required: false,
            errorAfterField: true,
            widget: widgets.select({
                classes: ['form-select']
            }),
            choices: manufacturers
        }),
        films: fields.string({
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: films
        }),
        min_stock: fields.number({
            required: false,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer(), validators.min(0)]
        }),
        max_stock: fields.number({
            required: false,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        })
    })
}

const searchOrdersForm = (orderStatus) => {
    return forms.create({
        status_id: fields.string({
            label: "Order Status",
            required: false,
            errorAfterField: true,
            widget: widgets.select({
                classes: ["form-select"]
            }),
            choices: orderStatus
        }),
        min_paid: fields.number({
            required: false,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        }),
        max_paid: fields.number({
            required: false,
            errorAfterField: true,
            widget: widgets.number(),
            validators: [validators.integer()]
        })
    })
}

const updateStatusForm = (orderStatus) => {
    return forms.create({
        status_id: fields.string({
            label: "Order Status",
            required: false,
            errorAfterField: true,
            widget: widgets.select({
                classes: ["form-select"]
            }),
            choices: orderStatus
        })
    })
}

module.exports = {
    createCameraForm,
    registrationForm,
    loginForm,
    searchForm,
    searchOrdersForm,
    updateStatusForm,
    bootstrapField
}