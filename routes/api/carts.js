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
        console.log(cartItems.toJSON())
        res.status(200)
        res.send(cartItems.toJSON())
    } catch (e) {
        res.status(500)
        res.send("Unable to retrieve Cart Items")
    }
})

router.post('/add', checkIfAuthenticatedJWT, async (req, res) => {
    console.log(req.body)
    let cart = new CartServices(req.user.id);
    console.log("testing")

    try {
        console.log("testing 2")
        console.log(req.body.quantity)
        await cart.addToCart(req.body.camera_id, req.body.quantity)
        console.log("error")
        res.status(200)
        console.log("Fired")
        res.send("Item has been added to cart successfully");
    } catch (e) {
        console.log(e.message)
        res.status(204)
        res.send("Item not found")
    }
})

router.delete('/remove', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    console.log(req.user)
    try {
        console.log("Test remove status 1")
        console.log(req.data)
        await cart.removeFromCart(req.body.camera_id)
        console.log("test remove status 2")
        res.status(200)
        console.log("Remove fired")
        res.send("Item removed from cart successfully");
    } catch (e) {
        console.log(e.message)
        res.status(204)
        res.send("Item not found")
    }
})

router.put('/quantity/update', checkIfAuthenticatedJWT, async (req, res) => {
    console.log("test 1")
    let cart = new CartServices(req.user.id);

    console.log("test 2")
    try {
        console.log("before")
        await cart.updateCartQuantity(req.body.camera_id)
        console.log("After")
        res.status(200)
        res.send("Quantity updated");
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

router.put('/quantity/remove', checkIfAuthenticatedJWT, async (req, res) => {
    let cart = new CartServices(req.user.id);
    try {
        await cart.removeCartQuantity(req.body.camera_id)
        res.status(200)
        res.send("Quantity Removed by 1")
    } catch (e) {
        res.status(204)
        res.send("Item not found")
    }
})

module.exports = router;