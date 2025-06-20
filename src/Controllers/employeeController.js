const { validationResult } = require('express-validator');
const UserRepo = require('../Repository/UserRepo');
const EmployeeRepo = require('../Repository/EmployeeRepo');
const { Employees, EmployeeDocuments, Users } = require('../../models');

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

            const { email } = req.body;
            const existingUser = await UserRepo.getByEmail(email);

            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    errors: ['Email already exists']
                });
            }

            const employee = await EmployeeRepo.create(req.body);

            if (employee) {
                return res.status(200).json({
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

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }

            const { id } = req.params;
            const { email } = req.body;

            const existingUser = await UserRepo.getByEmail(email);
            if (existingUser && existingUser.id != id) {
                return res.status(400).json({
                    status: false,
                    errors: ['Email already exists']
                });
            }

            const employee = await EmployeeRepo.update(id, req.body);
            if (!employee) {
                return res.status(404).json({
                    status: false,
                    errors: ['Employee not found']
                });
            }

            return res.status(200).json({
                status: true,
                msg: 'Employee updated successfully'
            });
        } catch (err) {
            console.error('Error in update:', err);
            res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getAllEmployee(req, res) {
        try {
            const employee = await Employees.findAll({
                include: [
                    {
                        model: EmployeeDocuments,
                        as: 'documents',
                        attributes: ['id', 'employee_id', 'type', 'file', 'text', 'status']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                status: true,
                data: employee
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

            const employee = await Employees.findOne({
                where: { id },
                include: [
                    {
                        model: EmployeeDocuments,
                        as: 'documents',
                        attributes: ['id', 'employee_id', 'type', 'file', 'text', 'status']
                    }
                ]
            });

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

    async delete(req, res) {
        try {
            const { id } = req.params;

            const employee = await Employees.findOne({ where: { id } });

            if (!employee) {
                return res.status(404).json({
                    status: false,
                    errors: ['Employee not found']
                });
            }
            const userId = employee.user_id;

            await employee.destroy();

            if (userId) {
                await Users.destroy({ where: { id: userId } });
            }

            return res.status(200).json({
                status: true,
                msg: 'Employee deleted successfully'
            });
        } catch (err) {
            console.error('Error in delete:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async createEmployeeDocument(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }

            const newDocument = await EmployeeRepo.createDocument(req.body);

            if (newDocument) {
                return res.status(200).json({
                    status: true,
                    msg: 'Employee document created successfully',
                    data: newDocument
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

    async updateEmployeeDocument(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }

            const { id } = req.params;

            const updateDocument = await EmployeeRepo.updateDocument(id, req.body);
            if (!updateDocument) {
                return res.status(404).json({
                    status: false,
                    errors: ['Employee document not found']
                });
            }

            return res.status(200).json({
                status: true,
                msg: 'Employee document updated successfully',
                data: updateDocument
            });
        } catch (err) {
            console.error('Error in update:', err);
            res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }
}

module.exports = employeeController;
