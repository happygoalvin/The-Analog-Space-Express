const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/:user_id', async (req, res) => {
    let cart = new CartServices(req.params.user_id);
    try {
        const cartItems = await cart.getCart()
        res.status(200)
        res.send(cartItems.toJSON())
    } catch (e) {
        res.status(500)
        res.send("Unable to retrieve Cart Items")
    }
})

router.post('/add/:user_id/:camera_id', async (req, res) => {
    let cart = new CartServices(req.body);
    try {
        await cart.addToCart(req.body, 1)
        res.status(200)
        res.send("Item has been added to cart successfully");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

router.get('/remove/:user_id/:camera_id', async (req, res) => {
    let cart = new CartServices(req.params.user_id);
    try {
        await cart.removeFromCart(req.params.camera_id)
        res.status(200)
        res.send("Item removed from cart successfully");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

router.post('/quantity/update/:user_id/:camera_id', async (req, res) => {
    let cart = new CartServices(req.params.user_id);
    try {
        await cart.updateCartQuantity(req.params.camera_id, req.body.newQuantity)
        res.status(200)
        res.send("Quantity updated");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

module.exports = router;