const express = require('express');
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');
const {
    Order
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
            withRelated: [camera]
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


module.exports = router;