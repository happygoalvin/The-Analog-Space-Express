const express = require('express');
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');
const {
    Order,
    Purchase
} = require('../../models');
const router = express.Router();

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {
    const userId = req.user.id;
    console.log("verify JWT passed")
    try {
        console.log("Before getting orders")
        const order = await Order.where({
            user_id: userId
        }).fetchAll({
            require: false,
            withRelated: ['camera']
        })
        console.log("after getting orders")
        if (order) {
            console.log(order.toJSON())
            res.status(200)
            res.send(order.toJSON())
        } else {
            res.status(204)
            res.send("No orders found")
        }
    } catch (e) {
        console.log(e.message)
    }
})

router.get('/items', checkIfAuthenticatedJWT, async (req, res) => {
    const orderId = req.body.order_id;
    try {
        const purchase = await Purchase.where({
            order_id: orderId
        }).fetchAll({
            require: false,
            withRelated: ['camera', 'camera.type', 'camera.manufacturer']
        })
        res.status(200)
        res.send(purchase.toJSON())
    } catch (e) {
        res.status(204)
        console.log(e.message)
    }
})


module.exports = router;