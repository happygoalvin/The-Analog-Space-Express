const express = require('express');
const router = express.Router();

const cameraDAL = require('../../dal/cameras');

router.get('/', async (req, res) => {
    res.send(await cameraDAL.getAllCameras());
})

module.exports = router;