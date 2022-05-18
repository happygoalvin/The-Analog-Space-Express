const express = require('express');
const router = express.Router();
const {
    Order,
    OrderStatus,
    Purchase,
    Camera,
    Cart
} = require('../models')

const {
    searchOrdersForm,
    updateStatusForm,
    bootstrapField
} = require('../forms')

const orderDAL = require('../dal/orders')

router.get('/', async (req, res) => {

    const orderStatuses = await orderDAL.getAllStatus();
    orderStatuses.unshift(["", "----"])

    const searchForm = searchOrdersForm(orderStatuses);

    let o = Order.collection();

    searchForm.handle(req, {
        empty: async (form) => {
            let order = await o.fetch({
                withRelated: ["camera", "user", "orderStatus", "purchase"]
            })

            let orderjson = order.toJSON();
            console.log(orderjson)

            res.render("orders/index", {
                order: order.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        error: async (form) => {
            let order = await o.fetch({
                withRelated: ["orderStatus", "camera", "user", "purchase"]
            })

            res.render("orders/index", {
                order: order.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        success: async (form) => {
            if (form.data.status_id && form.data.status_id != "0") {
                o = o.where('status_id', '=', form.data.status_id)
            }

            if (form.data.min_paid) {
                o = o.where('total_paid', '>=', req.query.min_paid)
            }

            if (form.data.max_paid) {
                o = o.where('total_paid', '<=', req.query.max_paid)
            }

            let order = await o.fetch({
                withRelated: ['orderStatus', "camera", "user", "purchase"]
            })
            res.render('orders/index', {
                order: order.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:order_id/update', async (req, res) => {
    const order = await orderDAL.getOrderById(req.params.order_id);
    const allStatus = await orderDAL.getAllStatus();

    const form = updateStatusForm(allStatus);
    form.fields.status_id.value = order.get("status_id")

    res.render("orders/update", {
        form: form.toHTML(bootstrapField),
        order: order.toJSON(),
    })
})

router.post('/:order_id/update', async (req, res) => {
    const order = await orderDAL.getOrderById(req.params.order_id);
    const allStatus = await orderDAL.getAllStatus();

    const form = updateStatusForm(allStatus);
    form.handle(req, {
        success: async (form) => {
            order.set(form.data)
            await order.save()
            req.flash("success_messages", "Order Status has been updated.")
            res.redirect('/orders')
        },
        error: async (form) => {
            res.render('orders/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:order_id/:camera_id/delete', async (req, res) => {
    const order = await orderDAL.getOrderById(req.params.order_id)
    const cameraId = req.params.camera_id;
    const cart = await Cart.where({
        camera_id: cameraId
    }).fetch({
        require: false
    });

    const cameraInOrders = await Order.where({
        camera_id: cameraId
    }).fetch({
        require: false
    })


    if (cart !== null || cameraInOrders !== null) {

        req.flash("error_messages", `Unable to delete, product is in a users cart/orders`)
        res.redirect("/orders")
    } else {
        res.render('orders/delete', {
            order: order.toJSON()
        })
    }
})

router.post('/:order_id/:camera_id/delete', async (req, res) => {
    const order = await orderDAL.getOrderById(req.params.order_id)
    const cameraId = req.params.camera_id
    const cart = await Cart.where({
        camera_id: cameraId
    }).fetch({
        require: false
    });
    const cameraInOrders = await Order.where({
        camera_id: cameraId
    }).fetch({
        require: false
    })

    if (cart !== null || cameraInOrders !== null) {
        req.flash("error_messages", `Unable to delete, product is in a users cart/orders`)
        res.redirect("/orders")
    } else {
        await order.destroy()
        req.flash("success_messages", "Order has been deleted")
        res.redirect("/orders")
    }
})

module.exports = router;