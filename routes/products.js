const router = require('express').Router();
const Controller = require('../controllers/controller'); 
const isAdmin = require('../middlewares/auth')

router.get('/', Controller.productIndex)
router.get('/add', isAdmin, Controller.addProduct)
router.post('/add', isAdmin, Controller.postAddProduct)
router.get('/:id', Controller.productDetail)
router.get('/:id/edit', isAdmin, Controller.editProduct)
router.post('/:id/edit', isAdmin, Controller.postEditProduct)
router.get('/:id/delete', isAdmin, Controller.deleteProduct)

module.exports = router;