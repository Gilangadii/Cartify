const router = require('express').Router();
const Controller = require('../controllers/controller'); 

router.get('/', Controller.showProfile);
router.get('/add', Controller.renderAddProfile);
router.post('/add', Controller.postAddProfile);

module.exports = router;