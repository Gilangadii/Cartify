const isAdmin = function (req, res, next) {
    console.log(req.session)
    if (req.session.userId && req.session.role !== "Admin") {
        const error = `You have no access!`
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
}

module.exports = isAdmin