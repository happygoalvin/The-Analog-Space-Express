const cartDataLayer = require('../dal/cart_items')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }

    async getUser() {
        return await cartDataLayer.getUser(this.user_id);
    }

    async addToCart(cameraId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(
            this.user_id, productId
        )
        if (cartItem) {
            return await cartDataLayer.updateQuantity(
                this.user_id,
                cameraId,
                cartItem.get('quantity') + quantity
            )
        } else {
            cartItem = await cartDataLayer.createCartItem(
                this.user_id,
                cameraId,
                quantity
            )
            return cartItem;
        }
    }

    async updateCartQuantity(cameraId, newQuantity) {
        await cartDataLayer.updateQuantity(this.user_id, cameraId, newQuantity);
    }

    async removeFromCart(cameraId) {
        await cartDataLayer.removeFromCart(this.user_id, cameraId);
    }
}

module.exports = CartServices;