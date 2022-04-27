const express = require('express');
const router = express.Router();

// FORMS
const {
    createCameraForm,
    bootstrapField
} = require('../forms')

// MODELS
const {
    Camera,
    Type,
    Classification
} = require('../models')

// REFACTORED CODE
async function getAllTypes() {
    const allTypes = await Type.fetchAll().map(type => {
        return [type.get('id'), type.get('name')]
    })
    return allTypes;
}

async function getAllClassifications() {
    const allClassifications = await Classification.fetchAll().map(classification => {
        return [classification.get('id'), classification.get('name')]
    })
    return allClassifications;
}

// REFACTORED CODE END

router.get('/', async (req, res) => {
    let cameras = await Camera.collection().fetch({
        withRelated: ['type']
    });
    res.render('cameras/index', {
        'cameras': cameras.toJSON()
    })
})

router.get('/create', (req, res) => {
    const cameraForm = createCameraForm()
    res.render('cameras/create', {
        form: cameraForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {

    const allTypes = await getAllTypes();
    const allClassifications = await getAllClassifications();

    const cameraForm = createCameraForm(allTypes, allClassifications);
    cameraForm.handle(req, {
        success: async (form) => {
            let {
                classifications,
                ...cameraData
            } = form.data;
            const camera = new Camera(cameraData);
            await camera.save();

            if (classifications) {
                await camera.classification().attach(classifications.split(","));
            }
            res.redirect('/cameras')
        },
        error: async (form) => {
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;