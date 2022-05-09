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
    order: function () {
        return this.belongsToMany('Order')
    },
    review: function () {
        return this.hasMany('Review')
    },
    purchase: function () {
        return this.hasMany('Purchase')
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
        return this.hasMany('Order')
    },
    address: function () {
        return this.belongsTo('Address')
    },
    review: function () {
        return this.hasMany('Review')
    }
})

const Cart = bookshelf.model('Cart', {
    tableName: 'cart_items',
    camera: function () {
        return this.belongsTo('Camera')
    },
    user: function () {
        return this.belongsTo('User')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user: function () {
        return this.belongsTo('User')
    },
    orderStatus: function () {
        return this.belongsTo('OrderStatus', 'status_id')
    },
    purchase: function () {
        return this.hasMany('Purchase')
    },
    camera: function () {
        return this.belongsToMany('Camera')
    },
})

const Address = bookshelf.model('Address', {
    tableName: 'addresses',
    user: function () {
        return this.hasMany('User')
    }
})

const Review = bookshelf.model('Review', {
    tableName: 'reviews',
    camera: function () {
        return this.belongsTo('Camera')
    },
    user: function () {
        return this.belongsTo('User')
    }
})

const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'order_statuses',
    order: function () {
        return this.hasMany('Order', 'status_id')
    }
})

const Purchase = bookshelf.model('Purchase', {
    tableName: 'cameras_orders',
    order: function () {
        return this.belongsTo('Order')
    },
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
    User,
    Cart,
    Order,
    Address,
    Review,
    OrderStatus,
    Purchase
};