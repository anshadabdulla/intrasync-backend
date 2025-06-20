const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/employeeController');
const employeeController = new EmployeeController();
const auth = require('../middleware/auth');

router.post('/employee', auth, employeeController.createEmployee);
router.put('/employee/:id', auth, employeeController.updateEmployee);
router.delete('/employee/:id', auth, employeeController.deleteEmployee);
router.get('/employee/:id', auth, employeeController.getEmployeeById);
router.get('/employee', auth, employeeController.getAllEmployee);

router.post('/employee-documents', auth, employeeController.createEmployeeDocument);
router.put('/employee-documents/:id', auth, employeeController.updateEmployeeDocument);
router.delete('/employee-documents/:id', auth, employeeController.deleteEmployeeDocument);

module.exports = router;
