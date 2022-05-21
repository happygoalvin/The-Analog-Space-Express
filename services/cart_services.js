const cartDataLayer = require('../dal/cart_items')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getCart() {
        let cart = await cartDataLayer.getCart(this.user_id);
        let quantity = cart.get('quantity')
        let cameraId = cart.get('camera_id')

        // if quantity = 0, remove from cart
        if (quantity == 0) {
            await cartDataLayer.removeFromCart(this.user_id, cameraId)
            return cart
        }
        return cart
    }

    async getUser() {
        return await cartDataLayer.getUser(this.user_id);
    }

    async addToCart(cameraId, quantity) {
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(
            this.user_id, cameraId
        )
        if (cartItem) {
            console.log("test")
            return await cartDataLayer.initialQuantity(
                this.user_id,
                cameraId,
                cartItem.get('quantity') + quantity
            )
        } else {
            console.log("creating new cart item...")
            cartItem = await cartDataLayer.createCartItem(
                this.user_id,
                cameraId,
                quantity
            )
            console.log(cartItem)
            return cartItem;
        }
    }

    async updateCartQuantity(cameraId) {
        let camera = await cartDataLayer.getStock(cameraId)
        let stock = camera.get('stock')

        // check if stock has run out
        try {
            if (stock == 0 || stock == null) {

                throw "Out of stock"
            } else {
                let update = await cartDataLayer.updateQuantity(this.user_id, cameraId);
                camera.set('stock', stock - 1)
                await camera.save();
                return update
            }
        } catch (error) {
            console.log(error)
        }
    }

    async removeCartQuantity(cameraId) {
        let cart = await cartDataLayer.getCart(this.user_id)
        console.log(cart.toJSON())
        let quantity = cart.toJSON().get('quantity')
        let camera = await cartDataLayer.getStock(cameraId)
        let stock = camera.get('stock');

        console.log("Before quantity < 0")
        console.log(typeof quantity)
        console.log(quantity)
        console.log(typeof stock)
        console.log(stock)
        // if cart is empty
        if (quantity > 0) {
            console.log("execute")
            console.log(typeof stock)
            camera.set('stock', stock + 1);
            await camera.save();
            return await cartDataLayer.removeQuantity(this.user_id, cameraId);
        } else if (quantity == 0) {
            await cartDataLayer.removeFromCart(this.user_id, cameraId);
        }
    }

    async removeFromCart(cameraId) {
        await cartDataLayer.removeFromCart(this.user_id, cameraId);
    }
}

module.exports = CartServices;