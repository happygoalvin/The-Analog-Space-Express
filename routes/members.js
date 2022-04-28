const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const {
    User
} = require('../models');

const {
    registrationForm,
    loginForm,
    bootstrapField
} = require('../forms');

const {
    checkIfAuthenticated
} = require('../middlewares')

router.get('/register', (req, res) => {
    const registration = registrationForm();

    res.render('members/register', {
        form: registration.toHTML(bootstrapField)
    })
})

router.post('/register', (req, res) => {
    const registration = registrationForm();
    registration.handle(req, {
        success: async (form) => {
            const user = new User({
                first_name: form.data.first_name,
                last_name: form.data.last_name,
                email: form.data.email,
                password: getHashedPassword(form.data.password),
                role: 'Admin'
            });
            await user.save();
            req.flash("success_messages", `You have registered successfully!`)
            res.redirect('/members/login')
        },
        error: async (form) => {
            res.render('members/register', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', (req, res) => {
    const login = loginForm();
    res.render('members/login', {
        form: login.toHTML(bootstrapField)
    })
})

router.post('/login', (req, res) => {
    const login = loginForm();
    login.handle(req, {
        success: async (form) => {
            let user = await User.where({
                email: form.data.email
            }).fetch({
                require: false
            });

            if (!user) {
                req.flash("error_messages", `Please enter your login details`)
                res.redirect('/members/login');
            } else {
                if (user.get('password') === getHashedPassword(form.data.password)) {
                    req.session.user = {
                        id: user.get('id'),
                        first_name: user.get('first_name'),
                        email: user.get('email')
                    }
                    req.flash("success_messages", `Welcome back, ${user.get('first_name')}`);
                    res.redirect('/members/profile');
                } else {
                    req.flash("error_messages", `Invalid login details, please retry.`)
                    res.redirect('/members/login');
                }
            }
        },
        error: (form) => {
            req.flash('error_messages', `Sorry, there was an issue logging you in. Please re-attempt to login.`)
            res.render('members/login', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', checkIfAuthenticated, (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash("error_messages", `Please login to view this page`);
        res.redirect('/members/login');
    } else {
        res.render('members/profile', {
            user: user
        })
    }

})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash("success_messages", `You have successfully logged out.`);
    res.redirect('/members/login')
})

module.exports = router;