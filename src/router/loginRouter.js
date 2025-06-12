const express = require('express');
const router = express.Router();
const LoginController = require('../Controllers/loginController.js');

const loginController = new LoginController();

router.post("/api", loginController.login);

module.exports = router;