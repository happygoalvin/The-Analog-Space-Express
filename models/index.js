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
    cart: function () {
        return this.belongsToMany('Cart')
    },
    order: function () {
        return this.belongsToMany('Order')
    },
    review: function () {
        return this.hasMany('Review')
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
    cart: function () {
        return this.belongsToMany('Cart')
    },
    review: function () {
        return this.hasMany('Review')
    }
})

const Cart = bookshelf.model('Cart', {
    tableName: 'cart_items',
    camera: function () {
        return this.belongsToMany('Camera')
    },
    user: function () {
        return this.belongsToMany('User')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user: function () {
        return this.belongsTo('User')
    },
    camera: function () {
        return this.belongsToMany('Camera')
    },
    orderStatus: function () {
        return this.belongsTo('OrderStatus')
    }
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
        return this.hasMany('Order')
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
    OrderStatus
};