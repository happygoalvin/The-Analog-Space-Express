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
    try {
        const order = await Order.where({
            user_id: userId
        }).fetchAll({
            require: false,
            withRelated: [camera]
        })
        if (order) {
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