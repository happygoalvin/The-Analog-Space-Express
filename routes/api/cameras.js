const express = require('express');
const router = express.Router();

const cameraDAL = require('../../dal/cameras');

router.get('/', async (req, res) => {
    res.send(await cameraDAL.getLandingCameras());
})

router.get('/products', async (req, res) => {
    res.send(await cameraDAL.getAllCameras())
})

router.get('/products/:camera_id', async (req, res) => {
    res.send(await cameraDAL.getCameraById(req.params.camera_id));
})

module.exports = router;