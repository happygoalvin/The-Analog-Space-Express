const {
    Cart,
    User,
    Camera
} = require('../models');

const getCart = async (userId) => {
    return await Cart.where({
        user_id: userId
    }).fetchAll({
        require: false,
        withRelated: ['camera', 'camera.type', 'camera.manufacturer']
    })
}

const getUser = async (userId) => {
    return await User.where({
        id: userId
    }).fetch({
        require: false
    })
}

const getCartItemByUserAndProduct = async (userId, cameraId) => {
    return await Cart.where({
        user_id: userId,
        camera_id: cameraId
    }).fetch({
        require: false
    });
}

async function createCartItem(userId, cameraId, quantity) {
    const cartItem = new Cart({
        user_id: userId,
        camera_id: cameraId,
        quantity: quantity
    })
    await cartItem.save()
    return cartItem
}

async function removeFromCart(userId, cameraId) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function getStock(cameraId) {
    return await Camera.where({
        id: cameraId
    }).fetch({
        require: false
    })
}

async function updateQuantity(userId, cameraId) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    if (cartItem) {
        console.log("problem here at cart items?")
        cartItem.set('quantity', +1);
        await cartItem.save();
        return cartItem;
    }
    return false;
}

async function initialQuantity(userId, cameraId, quantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    console.log("init quantity")
    if (cartItem) {
        console.log("setting quantity")
        cartItem.set('quantity', quantity);
        await cartItem.save();
        return cartItem;
    }
    return false;
}

async function removeQuantity(userId, cameraId) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    let quantity = cartItem.get('quantity')
    if (quantity > 0) {
        cartItem.set('quantity', quantity - 1);
        await cartItem.save();
        return cartItem;
    } else {
        removeFromCart(userId, cameraId)
    }
}

module.exports = {
    getCart,
    getCartItemByUserAndProduct,
    createCartItem,
    getStock,
    removeFromCart,
    removeQuantity,
    updateQuantity,
    initialQuantity,
    getUser
}