const {
    Cart,
    User
} = require('../models');

const getCart = async (userId) => {
    return await Cart.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['camera', 'camera.type', 'camera.manufacturer']
    })
}

const getUser = async (userId) => {
    return await User.collection().where({
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
    let cartItem = new Cart({
        user_id: userId,
        camera_id: cameraId,
        quantity: quantity
    })
    await cartItem.save();
    return cartItem;
}

async function removeFromCart(userId, cameraId) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}

async function updateQuantity(userId, cameraId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, cameraId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return cartItem;
    }
    return false;
}

module.exports = {
    getCart,
    getCartItemByUserAndProduct,
    createCartItem,
    removeFromCart,
    updateQuantity,
    getUser
}