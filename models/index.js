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
    tableName: 'manufacturers',
    camera: function () {
        return this.hasMany('Camera')
    }
})

const Film = bookshelf.model('Film', {
    tableName: 'films',
    camera: function () {
        return this.belongsToMany('Camera')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users',
    order: function () {
        return this.hasMany('User')
    }
})

const Cart = bookshelf.model('Cart', {
    tableName: 'cart_items',
    camera: function () {
        return this.belongsTo('Camera')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user: function () {
        return this.belongsTo('User')
    }
})

module.exports = {
    Camera,
    Type,
    Classification,
    Manufacturer,
    Film,
    User,
    Cart,
    Order
};