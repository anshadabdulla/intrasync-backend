const express = require('express');
const router = express.Router();
const LoginController = require('../Controllers/loginController');
const loginController = new LoginController();
const auth = require('../middleware/auth');

router.post('/login', loginController.login);
router.post('/forgotPassword',auth, loginController.forgotPassword);
router.post('/resetPassword',auth, loginController.resetPassword);


module.exports = router;
