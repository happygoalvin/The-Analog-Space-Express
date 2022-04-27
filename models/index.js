const bookshelf = require('../bookshelf')

const Camera = bookshelf.model('Camera', {
    tableName: 'cameras',
    type: function () {
        return this.belongsTo('Type')
    },
    classification: function () {
        return this.belongsToMany('Classification')
    },
    manufacturer: function () {
        return this.belongsTo('Manufacturer')
    },
    film: function () {
        return this.belongsToMany('Film')
    },
    image: function () {
        return this.hasMany('Image')
    }
});

const Type = bookshelf.model('Type', {
    tableName: 'types',
    camera: function () {
        return this.hasMany('Camera')
    }
})

const Classification = bookshelf.model('Classification', {
    tableName: 'classifications',
    camera: function () {
        return this.belongsToMany('Camera')
    }
})

const Manufacturer = bookshelf.model('Manufacturer', {
    tableName: 'Manufacturer',
    camera: function () {
        return this.hasMany('Camera')
    }
})

const Film = bookshelf.model('Film', {
    tableName: 'Films',
    camera: function () {
        return this.belongsToMany('Camera')
    }
})

const Image = bookshelf.model('Image', {
    tableName: 'Images',
    camera: function () {
        return this.belongsTo('Camera')
    }
})

module.exports = {
    Camera,
    Type,
    Classification,
    Manufacturer,
    Film,
    Image
};