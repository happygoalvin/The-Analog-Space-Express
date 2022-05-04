const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services');

router.get('/', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.send((await cart.getCart()).toJSON())
})

router.get('/:camera_id/add', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.send(await cart.addToCart(req.params.camera_id, 1));
})

router.get('/:camera_id/remove', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.send(await cart.removeFromCart(req.params.camera_id));
})

router.post('/:camera_id/quantity/update', async (req, res) => {
    let cart = new CartServices(req.session.user.id);
    res.send(await cart.updateCartQuantity(req.params.camera_id, req.body.newQuantity));
})

module.exports = router;