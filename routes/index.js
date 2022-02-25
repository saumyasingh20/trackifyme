const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/reset-password',require('./reset_password'));
router.use('/habits', require('./habit'));
module.exports = router;