const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require("cors");
require("dotenv").config();

// import sessions
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// import csurf
const csrf = require('csurf');

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// setup sessions
app.use(session({
    'store': new FileStore(),
    'secret': process.env.SESSION_SECRET_KEY,
    'resave': false,
    'saveUninitialized': true
}))

// setup flash message
app.use(flash());

// display in the hbs file
app.use(function (req, res, next) {
    // transfer any success messages stored in the session
    // to the variables in hbs files
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash('error_messages');
    next();
})

// enable cors
app.use(cors());

// enable CSRF
app.use(csrf());

// Handle CSRF errors
app.use((err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next();
    }
})

// Share CSRF with HBS files
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
})

// Share user data with HBS files
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})



// All routes
const cameraRoutes = require('./routes/cameras')
const memberRoutes = require('./routes/members')
const cloudinaryRoutes = require('./routes/cloudinary')

const api = {
    carts: require('./routes/api/carts')
}

const {
    checkIfAuthenticated
} = require('./middlewares')


async function main() {
    app.use('/cameras', checkIfAuthenticated, cameraRoutes)
    app.use('/members', memberRoutes)
    app.use('/cloudinary', cloudinaryRoutes)
    app.use('/cart', express.json(), api.carts)
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});