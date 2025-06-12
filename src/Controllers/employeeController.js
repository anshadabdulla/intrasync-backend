const { validationResult } = require('express-validator');
const UserRepo = require('../Repository/UserRepo');
const EmployeeRepo = require('../Repository/EmployeeRepo');
const Employee = require('../../models/employee');

class employeeController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }

            const { email, name, employee_no } = req.body;

            const existingUser = await UserRepo.getByEmail(email);

            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    errors: ['Email already exists']
                });
            }

            const user = await UserRepo.createUserAndEmployee({ email, employee_no });

            const employee = await EmployeeRepo.create(user, { email, name, employee_no });

            if (employee) {
                return res.status(201).json({
                    status: true,
                    msg: 'Employee created successfully'
                });
            } else {
                return res.status(500).json({
                    status: false,
                    errors: ['Something went wrong']
                });
            }
        } catch (err) {
            console.error('Error in create:', err);
            res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getAllEmployee(req, res) {
        try {
            const employees = await Employee.findAll();

            return res.status(200).json({
                status: true,
                data: employees
            });
        } catch (err) {
            console.error('Error in FindEmplpoyee:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getEmployeeById(req, res) {
        try {
            const { id } = req.params;

            const employee = await Employee.findOne({ where: { id } });

            if (!employee) {
                return res.status(404).json({
                    status: false,
                    errors: ['Employee not found']
                });
            }

            return res.status(200).json({
                status: true,
                data: employee
            });
        } catch (err) {
            console.error('Error in getEmployeeById:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }
}

module.exports = employeeController;
