const {
    User
} = require('../models')

const getUserById = async (userId) => {
    const user = await User.where({
        id: userId
    }).fetch({
        require: true
    })
    return user
}

module.exports = {
    getUserById
}