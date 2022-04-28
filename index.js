const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const cors = require("cors");
require("dotenv").config();

// import sessions
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

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
    'secret': 'keyboard cat',
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

// All routes
const cameraRoutes = require('./routes/cameras')
const memberRoutes = require('./routes/members')

const {
    checkIfAuthenticated
} = require('./middlewares')

async function main() {
    app.use('/cameras', checkIfAuthenticated, cameraRoutes)
    app.use('/members', memberRoutes)
}

main();

app.listen(3000, () => {
    console.log("Server has started");
});