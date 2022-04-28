const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", `Please login to view this page`);
        res.redirect('/members/login')
    }
}

module.exports = {
    checkIfAuthenticated
}