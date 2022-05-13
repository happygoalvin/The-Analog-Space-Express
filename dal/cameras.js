const {
    Type,
    Classification,
    Film,
    Manufacturer,
    Camera
} = require('../models')

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

const getAllCameras = async () => {
    return await Camera.fetchAll();
}

const getLandingCameras = async () => {
    return await Camera.query(eachc => {
        return eachc.limit(10), eachc.orderBy('created_date', 'desc')
    }).fetch({
        withRelated: ['type', 'manufacturer', 'film', 'classification']
    });
}

module.exports = {
    getAllTypes,
    getAllClassifications,
    getAllFilms,
    getAllManufacturers,
    getCameraById,
    getAllCameras,
    getLandingCameras
}