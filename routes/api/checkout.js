const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const CartServices = require('../../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/:user_id/', async (req, res) => {
    const cart = new CartServices(req.params.user_id);

    // get all the items from the cart
    let cartItems = await cart.getCart();
    let userDetails = await cart.getUser();

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
            quantity: item.get('quantity')
        })
    }

    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card', 'grabpay', 'paynow'],
        line_items: lineItems,
        customer_email: userDetails.get('email'),
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            orders: metaData
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.send({
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.post('/process_payment', bodyParser.raw({
        type: 'application/json'
    }),
    async (req, res) => {
        let payload = req.body;
        let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
        let sigHeader = req.headers["stripe-signature"];
        let event;
        try {
            event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        } catch (e) {
            res.send({
                error: e.message
            })
            console.log(e.message)
        }
        if (event.type == 'checkout.session.completed') {
            let stripeSession = event.data.object;
            console.log(stripeSession);
        }
        res.send({
            received: true
        });
    })

module.exports = router;