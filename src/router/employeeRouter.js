const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const employeeController = new EmployeeController();
const auth = require('../middleware/auth');

router.post('/employee', auth, employeeController.createEmployee);
router.put('/employee/:id', auth, employeeController.updateEmployee);
router.get('/employee/:id', auth, employeeController.getEmployeeById);
router.get('/employee', auth, employeeController.getAllEmployee);
router.delete('/employee/:id', auth, employeeController.deleteEmployee);
router.get('/employee-tl', auth, employeeController.getAllEmployeeTL);

router.post('/employee-document', auth, employeeController.createEmployeeDocument);
router.put('/employee-document/:id', auth, employeeController.updateEmployeeDocument);
router.delete('/employee-document/:id', auth, employeeController.deleteEmployeeDocument);

module.exports = router;
