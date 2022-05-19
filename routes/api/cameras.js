const express = require('express');
const router = express.Router();

const cameraDAL = require('../../dal/cameras');
const {
    Camera
} = require('../../models');

router.get('/', async (req, res) => {
    res.send(await cameraDAL.getLandingCameras());
})

router.get('/classifications', async (req, res) => {
    res.send(await cameraDAL.getAllClassifications());
})

router.get('/products', async (req, res) => {
    res.send(await cameraDAL.getAllCameras());
})

// search all products by returning a body
router.post('/products', async (req, res) => {
    let q = Camera.collection();

    let name = req.body.name
    let min_cost = req.body.min_cost
    let max_cost = req.body.max_cost
    let type_id = req.body.type_id;
    let manufacturer_id = req.body.manufacturer_id
    let classification_id = req.body.classification_id
    let film_id = req.body.film_id

    if (name) {
        q = q.where("name", "like", `%${name}%`)
    }

    if (min_cost) {
        q = q.where('cost', '>=', req.query.min_cost)
    }

    if (max_cost) {
        q = q.where('cost', '<=', req.query.max_cost)
    }

    if (type_id) {
        q = q.where('type_id', "=", type_id)
    }

    if (manufacturer_id) {
        q = q.where('manufacturer_id', '=', manufacturer_id)
    }

    if (classification_id) {
        q = q.query('join', 'cameras_classifications', 'cameras.id', 'camera_id')
            .where('classification_id', 'in', classification_id.split(','))
    }

    if (film_id) {
        q = q.query('join', 'cameras_films', 'cameras.id', 'camera_id')
            .where('film_id', 'in', film_id.split(','))
    }

    let searchFilter = await q.fetch({
        withRelated: ['type', 'manufacturer', 'classification', 'film']
    })

    res.status(200);
    res.send(searchFilter.toJSON())
})

router.get('/products/:camera_id', async (req, res) => {
    res.send(await cameraDAL.getCameraById(req.params.camera_id));
})

router.get('/manufacturer', async (req, res) => {
    res.send(await cameraDAL.getAllManufacturers());
})

router.get('/films', async (req, res) => {
    res.send(await cameraDAL.getAllFilms());
})

router.get('/type', async (req, res) => {
    res.send(await cameraDAL.getAllTypes());
})

module.exports = router;