const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/employeeController');
const employeeController = new EmployeeController();
const auth = require('../middleware/auth');

router.post('/employee', auth, employeeController.create.bind(employeeController));
router.get('/employee', auth, employeeController.getAllEmployee.bind(employeeController));

module.exports = router;
