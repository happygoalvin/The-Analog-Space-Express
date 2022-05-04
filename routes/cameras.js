const express = require('express');
const {
    trigger
} = require('../bookshelf');
const router = express.Router();

// FORMS
const {
    createCameraForm,
    searchForm,
    bootstrapField
} = require('../forms')

// MODELS
const {
    Camera,
    Type,
    Classification,
    Manufacturer,
    Film
} = require('../models')

// REFACTORED CODE
async function getAllTypes() {
    const allTypes = await Type.fetchAll().map(type => {
        return [type.get('id'), type.get('name')]
    })
    return allTypes;
};

async function getAllClassifications() {
    const allClassifications = await Classification.fetchAll().map(classification => {
        return [classification.get('id'), classification.get('name')]
    })
    return allClassifications;
};

async function getAllFilms() {
    const allFilms = await Film.fetchAll().map(film => {
        return [film.get('id'), film.get('name')]
    })
    return allFilms;
};

async function getAllManufacturers() {
    const allManufacturers = await Manufacturer.fetchAll().map(manufacturer => {
        return [manufacturer.get('id'), manufacturer.get('name')]
    })
    return allManufacturers;
};

async function getCameraById(cameraId) {
    const camera = await Camera.where({
        id: cameraId
    }).fetch({
        require: true,
        withRelated: ['type', 'manufacturer', 'film', 'classification']
    });
    return camera;
};
// REFACTORED CODE END

router.get('/', async (req, res) => {
    // const cameras = await Camera.collection().fetch({
    //     withRelated: ['type', 'manufacturer', 'film', 'classification']
    // });
    // res.render('cameras/index', {
    //     'camera': cameras.toJSON()
    // })

    const allTypes = await getAllTypes();
    allTypes.unshift(["", '----']);

    const allManufacturers = await getAllManufacturers();
    allManufacturers.unshift(["", '----']);

    const allFilms = await getAllFilms();

    let search = searchForm(allTypes, allManufacturers, allFilms)

    let c = Camera.collection();

    search.handle(req, {
        'empty': async (form) => {
            let cameras = await c.fetch({
                withRelated: ['type', 'manufacturer', 'film']
            })
            res.render('cameras/index', {
                camera: cameras.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let cameras = await c.fetch({
                withRelated: ['type', 'manufacturer', 'film']
            })
            res.render('cameras/index', {
                camera: cameras.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.type_id && form.data.type_id != "0") {
                c = c.where('type_id', '=', form.data.type_id)
            }

            if (form.data.manufacturer_id && form.data.manufacturer_id != "0") {
                c = c.where('manufacturer_id', '=', form.data.manufacturer_id)
            }

            if (form.data.films) {
                c = c.query('join', 'cameras_films', 'cameras.id', 'camera_id')
                    .where('film_id', 'in', form.data.films.split(','))
            }

            if (form.data.min_stock) {
                c = c.where('stock', '>=', req.query.min_stock)
            }

            if (form.data.max_stock) {
                c = c.where('stock', '<=', req.query.max_stock);
            }

            let cameras = await c.fetch({
                withRelated: ['type', 'manufacturer', 'film']
            })
            res.render('cameras/index', {
                camera: cameras.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/create', async (req, res) => {

    const allTypes = await getAllTypes();
    const allClassifications = await getAllClassifications();
    const allManufacturers = await getAllManufacturers();
    const allFilms = await getAllFilms();

    const cameraForm = createCameraForm(allTypes, allClassifications, allManufacturers, allFilms)
    res.render('cameras/create', {
        form: cameraForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/create', async (req, res) => {

    const allTypes = await getAllTypes();
    const allClassifications = await getAllClassifications();
    const allManufacturers = await getAllManufacturers();
    const allFilms = await getAllFilms();

    const cameraForm = createCameraForm(allTypes, allClassifications, allManufacturers, allFilms);
    cameraForm.handle(req, {
        success: async (form) => {
            let {
                classifications,
                films,
                ...cameraData
            } = form.data;
            const camera = new Camera(cameraData);
            await camera.save();

            if (classifications) {
                await camera.classification().attach(classifications.split(","));
            }

            if (films) {
                await camera.film().attach(films.split(","));
            }
            req.flash("success_messages", `${camera.get('name')} has been successfully added to the catalogue`)

            res.redirect('/cameras')
        },
        error: async (form) => {
            res.render('cameras/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});

router.get('/:camera_id/update', async (req, res) => {

    const camera = await getCameraById(req.params.camera_id);
    const allTypes = await getAllTypes();
    const allClassifications = await getAllClassifications();
    const allManufacturers = await getAllManufacturers();
    const allFilms = await getAllFilms();

    const cameraForm = createCameraForm(allTypes, allClassifications, allManufacturers, allFilms);

    cameraForm.fields.name.value = camera.get('name');
    cameraForm.fields.type_id.value = camera.get('type_id');
    cameraForm.fields.manufacturer_id.value = camera.get('manufacturer_id');
    cameraForm.fields.created_date.value = camera.get('created_date');
    cameraForm.fields.description.value = camera.get('description');
    cameraForm.fields.stock.value = camera.get('stock');
    cameraForm.fields.cost.value = camera.get('cost');
    cameraForm.fields.camera_ISO.value = camera.get('camera_iso');
    cameraForm.fields.shutter_speed.value = camera.get('shutter_speed');
    cameraForm.fields.aperture.value = camera.get('aperture');
    cameraForm.fields.focal_length.value = camera.get('focal_length');
    cameraForm.fields.flash.value = camera.get('flash');
    cameraForm.fields.battery.value = camera.get('battery');
    cameraForm.fields.body_color.value = camera.get('body_color');
    cameraForm.fields.format.value = camera.get('format');
    cameraForm.fields.weight.value = camera.get('weight');
    cameraForm.fields.image_url.value = camera.get('image_url');

    let selectedClassifications = await camera.related('classification').pluck('id');
    cameraForm.fields.classifications.value = selectedClassifications;

    let selectedFilms = await camera.related('film').pluck('id');
    cameraForm.fields.films.value = selectedFilms;

    res.render('cameras/update', {
        form: cameraForm.toHTML(bootstrapField),
        camera: camera.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

router.post('/:camera_id/update', async (req, res) => {

    const camera = await getCameraById(req.params.camera_id);
    const allTypes = await getAllTypes();
    const allClassifications = await getAllClassifications();
    const allManufacturers = await getAllManufacturers();
    const allFilms = await getAllFilms();

    const cameraForm = createCameraForm(allTypes, allClassifications, allManufacturers, allFilms);
    cameraForm.handle(req, {
        success: async (form) => {
            let {
                classifications,
                films,
                ...cameraData
            } = form.data;
            camera.set(cameraData)
            await camera.save();

            let selectedClassificationId = classifications.split(',');
            let selectedFilmId = films.split(',');

            let existingClassifications = await camera.related('classification').pluck('id');
            let existingFilms = await camera.related('film').pluck('id');

            let removeClassifications = existingClassifications.filter(id => selectedClassificationId.includes(id) === false);
            let removeFilms = existingFilms.filter(id => selectedFilmId.includes(id) === false);

            await camera.classification().detach(removeClassifications);
            await camera.film().detach(removeFilms);

            await camera.classification().attach(selectedClassificationId);
            await camera.film().attach(selectedFilmId);

            req.flash("success_messages", `${camera.get('name')} has been successfully updated`)
            res.redirect('/cameras')
        },
        error: async (form) => {
            res.render('cameras/update', {
                form: form.toHTML(bootstrapField),
                camera: camera.toJSON()
            })
        }
    })
});

router.get('/:camera_id/delete', async (req, res) => {

    const camera = await getCameraById(req.params.camera_id);

    res.render('cameras/delete', {
        camera: camera.toJSON()
    })
});

router.post('/:camera_id/delete', async (req, res) => {
    const camera = await getCameraById(req.params.camera_id);
    await camera.destroy();
    req.flash("success_messages", `Selected camera has been successfully deleted`)
    res.redirect('/cameras')
})



module.exports = router;