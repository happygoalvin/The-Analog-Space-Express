const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {
    checkIfAuthenticatedJWT
} = require('../../middlewares');
const {
    BlacklistedToken
} = require('../../models')

const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'first_name': user.first_name,
        'id': user.id,
        'email': user.email,
        'role': user.role
    }, secret, {
        expiresIn: expiresIn
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const {
    User
} = require('../../models');

const userDAL = require('../../dal/users');

router.post('/login', async (req, res) => {

    let user = await User.where({
        email: req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        const userObject = {
            "first_name": user.get("first_name"),
            'email': user.get("email"),
            'id': user.get("id"),
            'role': user.get('role')
        }

        let accessToken = generateAccessToken(userObject, process.env.TOKEN_SECRET, '15m');
        let refreshToken = generateAccessToken(userObject, process.env.REFRESH_TOKEN_SECRET, '7d');
        let id = user.get("id");
        res.send({
            accessToken,
            refreshToken,
            id
        })
    } else {
        res.status(204)
        res.send({
            "Error": "Invalid email or password"
        })
    }
})

router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const customer = req.user.role;
    const userId = req.user.id;
    if (customer == "Customer") {
        const userDetails = await User.where({
            id: userId
        }).fetch({
            require: false
        })
        res.send(userDetails)
    } else {
        res.status(401)
        res.send({
            "Error": "Unauthorized Access"
        })
    }
})



router.post('/refresh', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    }

    let blacklistedToken = await BlacklistedToken.where({
        token: refreshToken
    }).fetch({
        require: false
    })

    if (blacklistedToken) {
        res.status(401);
        res.send("Token has expired")
        return
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            let accessToken = generateAccessToken({
                "first_name": user.name,
                "email": user.email,
                "id": user.id
            }, process.env.TOKEN_SECRET, "15m")
            res.send({
                accessToken
            })
        }
    })
})

router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        let blacklistedToken = await BlacklistedToken.where({
            token: refreshToken
        }).fetch({
            require: false
        })

        if (blacklistedToken) {
            res.status(401)
            res.send("Token has expired");
            return
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date()); // use current date
            await token.save();
            res.send({
                'message': 'You have been logged out'
            })
        })
    }
})

router.post('/register', async (req, res) => {
    let verifyEmail = await User.where({
        email: req.body.email
    }).fetch({
        require: false
    })

    if (verifyEmail) {
        res.send("Email already exists. Please try to login")
    } else {
        try {
            const user = new User();
            user.set("first_name", req.body.first_name);
            user.set("last_name", req.body.last_name);
            user.set("email", req.body.email);
            user.set("password", getHashedPassword(req.body.password));
            user.set("role", "Customer");
            user.set('contact_number', req.body.contact_number);
            await user.save();

            res.send(user)
        } catch (e) {
            console.log(e)
            res.send("Unable to register new customer")
        }
    }
})

router.get('/update/:user_id', async (req, res) => {
    try {
        const user = await userDAL.getUserById(req.params.user_id)
        res.send(user)
    } catch (e) {
        console.log(e)
        res.send("Unable to retrieve account details")
    }
})

router.post('/update/:user_id', async (req, res) => {
    const user = await userDAL.getUserById(req.params.user_id)

    if (req.body.password) {
        try {
            user.set("password", getHashedPassword(req.body.password))
            user.save()
            res.send("Password has been updated")
        } catch (e) {
            res.send("Unable to update password. Please try again.")
        }
    }
})

router.get('/delete/:user_id', async (req, res) => {
    const user = await userDAL.getUserById(req.params.user_id)
    res.send(user)
})

router.post('/delete/:user_id', async (req, res) => {
    const user = await userDAL.getUserById(req.params.user_id)
    await user.destroy();
    res.send("Your account has been deleted")
})


module.exports = router;