const express = require('express');
const router = express.Router();
const EmployeeController = require('../Controllers/employeeController');
const employeeController = new EmployeeController();
const auth = require('../middleware/auth');

router.post('/employee', auth, employeeController.create);
router.put('/update/:id', auth, employeeController.update);
router.delete('/delete/:id', auth, employeeController.delete);
router.get('/getAllEmployee', auth, employeeController.getAllEmployee);
router.get('/getEmployeeById/:id', auth, employeeController.getEmployeeById);
router.post('/employee-documents-create', auth, employeeController.createEmployeeDocument);
router.put('/employee-documents-update/:id', auth, employeeController.updateEmployeeDocument);

module.exports = router;
