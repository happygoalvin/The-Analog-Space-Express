const express = require('express');
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    try {
        const cartItems = await cart.getCart()
        res.status(200)
        res.send(cartItems.toJSON())
    } catch (e) {
        res.status(500)
        res.send("Unable to retrieve Cart Items")
    }
})

router.post('/add/:camera_id', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    try {
        await cart.addToCart(req.params.camera_id, req.body.quantity)
        res.status(200)
        res.send("Item has been added to cart successfully");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

router.delete('/remove/:camera_id', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    try {
        await cart.removeFromCart(req.params.camera_id)
        res.status(200)
        res.send("Item removed from cart successfully");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

router.put('/quantity/update/:camera_id', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    try {
        await cart.updateCartQuantity(req.params.camera_id, req.body.quantity)
        res.status(200)
        res.send("Quantity updated");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

module.exports = router;