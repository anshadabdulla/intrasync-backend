const express = require('express');
const router = express.Router();
const LoginController = require('../Controllers/loginController');
const loginController = new LoginController();

router.post('/login', loginController.login);
router.post('/forgotPassword', loginController.forgotPassword);
router.post('/resetPassword', loginController.resetPassword);


module.exports = router;
