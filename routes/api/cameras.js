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
    console.log("Checkpoint 1")
    console.log(req.query.name)
    const products = await Camera.collection().query(cam => {
        if (req.query.name) {
            cam.where("name", "like", `%${req.query.name}%`)
        }
        if (req.query.type_id != 0) {
            cam.where("type_id", "=", req.query.type_id)
        }
        if (req.query.manufacturer_id != 0) {
            cam.where("manufacturer_id", "=", req.query.manufacturer_id)
        }
        if (req.query.min_cost) {
            cam.where('cost', '>=', req.query.min_cost)
        }
        if (req.query.max_cost) {
            cam.where('cost', '<=', req.query.max_cost)
        }
    }).fetch({
        withRelated: ['type', 'manufacturer', 'film', 'classification'];
    })

    res.status(200);
    res.send(products);
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