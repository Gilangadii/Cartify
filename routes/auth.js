const router = require('express').Router();
const Controller = require('../controllers/controller');

router.get('/register', Controller.getRegister); 
router.post('/register', Controller.postGetRegister);

router.get('/login', Controller.getLogin);
router.post('/login', Controller.postGetLogin);

router.get('/logout', Controller.handleLogout); 

module.exports = router;