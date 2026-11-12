const router = require('express').Router();
const Controller = require('../controllers/controller'); 

router.get('/', Controller.cartIndex)
router.get('/checkout', Controller.getCheckout)
router.post('/checkout', Controller.postGetCheckout)
router.post('/:productId/add', Controller.addToCart)
router.get('/:id/:productId/delete', Controller.deleteCartItem)

module.exports = router;