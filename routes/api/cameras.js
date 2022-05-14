const express = require('express');
const router = express.Router();

const cameraDAL = require('../../dal/cameras');

router.get('/', async (req, res) => {
    res.send(await cameraDAL.getLandingCameras());
})

router.get('/classifications', async (req, res) => {
    res.send(await cameraDAL.getAllClassifications());
})

router.get('/products', async (req, res) => {
    res.send(await cameraDAL.getAllCameras())
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