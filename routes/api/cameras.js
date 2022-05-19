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
    let c = Camera.collection();

    let name = req.body.name
    let min_cost = req.body.min_cost
    let max_cost = req.body.max_cost
    let type_id = req.body.type_id;
    let manufacturer_id = req.body.manufacturer_id
    let classification_id = req.body.classification_id

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