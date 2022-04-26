const express = require('express');
const router = express.Router();

// MODELS
const {
    Camera
} = require('../models')

router.get('/', (req, res) => {
    let cameras = await Camera.collection().fetch();
    res.render('cameras/index', {
        'cameras': cameras.toJSON()
    })
})

module.exports = router;