const Controller = require('../controllers/controller');
const router = require('express').Router()
const routerAuth = require("./auth")
const routerProducts = require("./products")
const routerCarts = require("./carts")
const routeProfiles = require('./profiles');

// ! ROUTE
// ? app.METHOD(PATH, HANDLER)
router.get('/', Controller.landingPage);

// ? panggil router yg lain (middleware)
router.use('/', routerAuth);

router.use(function (req, res, next) {
    console.log(req.session)
    if (!req.session.userId) {
        const error = `Please login first!`
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.use('/products', routerProducts);
router.use('/carts', routerCarts);
router.use('/profiles', routeProfiles);

module.exports = router