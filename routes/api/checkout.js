const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const CartServices = require('../../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
    User,
    Order,
    Purchase,
} = require('../../models');
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {
    const cart = new CartServices(req.user.id);

    // get all the items from the cart
    let cartItems = await cart.getCart();
    let user = await User.where({
        id: req.user.id
    }).fetch()

    let lineItems = [];
    let meta = [];
    for (let item of cartItems) {
        const lineItem = {
            name: item.related('camera').get('name'),
            amount: item.related('camera').get('cost'),
            quantity: item.get('quantity'),
            currency: 'SGD'
        }
        if (item.related('camera').get('image_url')) {
            lineItem['images'] = [item.related('camera').get('image_url')]
        }
        lineItems.push(lineItem);
        meta.push({
            camera_id: item.get('camera_id'),
            quantity: item.get('quantity'),
            user_id: user.get('id'),
            email: user.get('email')
        })
    }

    let metaData = JSON.stringify(meta);
    const payment = {
        client_reference_id: user.get('id'),
        payment_method_types: ['card', 'grabpay', 'paynow'],
        line_items: lineItems,
        billing_address_collection: 'required',
        customer_email: user.get('email'),
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            orders: metaData
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment)

    res.status(200)
    res.send({
        sessionId: stripeSession.id,
        stripeUrl: stripeSession.url,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.post("/process_payment", express.raw({
        type: "application/json"
    }),
    async (req, res) => {
        // let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let sigHeader = req.headers["stripe-signature"];
        let event;

        try {
            event = Stripe.webhooks.constructEvent(req.body, sigHeader, endpointSecret)
        } catch (e) {
            res.send({
                error: e.message
            })
            console.log(e.message)
        }

        console.log(event)
        if (event.type == "checkout.session.completed") {
            let stripeSession = event.data.object;
            let orderDetails = JSON.parse(event.data.object.metadata.orders)
            console.log(stripeSession)

            const order = new Order;
            order.set('status_id', 2); // set order status to processing
            order.set('user_id', stripeSession.client_reference_id);
            order.set('order_date', new Date());
            order.set('payment_status', stripeSession.payment_status);
            order.set('total_paid', stripeSession.amount_total);
            order.set('stripe_payment_id', stripeSession.id);
            order.set('address_line1', stripeSession.customer_details.address.line1)
            order.set('address_line2', stripeSession.customer_details.address.line2)
            order.set('address_postal_code', stripeSession.customer_details.address.postal_code)
            orderDetails.map(cam => {
                order.set('camera_id', cam.camera_id)
            })
            await order.save();

            for (let item of orderDetails) {
                const purchase = new Purchase;
                purchase.set('camera_id', item.camera_id);
                purchase.set('order_id', order.get('id'));
                purchase.set('quantity', item.quantity);
                purchase.set('total_cost', stripeSession.amount_total);
                await purchase.save();
            }

            const cartServices = new CartServices(stripeSession.client_reference_id);
            for (let product of orderDetails) {
                await cartServices.removeFromCart(product.camera_id);
            }
        }

        res.send({
            received: true
        });
    })

module.exports = router;