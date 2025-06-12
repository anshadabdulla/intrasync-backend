const express = require('express');
const router = express.Router();
const LoginController = require('../Controllers/loginController.js');
const EmployeeController = require("../Controllers/employeeController.js");



const loginController = new LoginController();
const employeeController = new EmployeeController();

router.post("/api", loginController.login);

module.exports = router;