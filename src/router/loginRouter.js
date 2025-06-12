const express = require('express');
const router = express.Router();
const LoginController = require('../Controllers/loginController.js');

const loginController = new LoginController();

router.post("/api/v1/login", loginController.login.bind(loginController));

module.exports = router;