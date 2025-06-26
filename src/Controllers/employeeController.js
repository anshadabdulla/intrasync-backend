const { validationResult } = require('express-validator');
const UserRepo = require('../repository/UserRepo');
const EmployeeRepo = require('../repository/EmployeeRepo');
const { Op, Sequelize } = require('sequelize');
const ExcelJS = require('exceljs');
const { getEmployeeHierarchy, formatDate } = require('../helper/commonHelper');
const { Employees, EmployeeDocuments, Users, Designations, Departments } = require('../../models');

class employeeController {
    async createEmployee(req, res) {
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

    async updateEmployee(req, res) {
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
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * pageSize;

            const whereClause = { status: 1 };

            if (req.query.name) {
                whereClause[Op.or] = [
                    { full_name: { [Sequelize.Op.iLike]: `%${req.query.name}%` } },
                    { employee_no: { [Sequelize.Op.iLike]: `%${req.query.name}%` } }
                ];
            }

            if (req.query.department) {
                whereClause.department = req.query.department;
            }

            if (req.query.designation) {
                whereClause.designation = req.query.designation;
            }

            if (req.query.teamlead) {
                whereClause.teamlead = req.query.teamlead;
            }

            if (req.query.status) {
                whereClause.status = req.query.status;
            }

            const { count, rows: employees } = await Employees.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Designations,
                        as: 'Designation',
                        attributes: ['id', 'name', 'type', 'notice_period']
                    },
                    {
                        model: Departments,
                        as: 'Department',
                        attributes: ['id', 'name']
                    }
                ],
                limit: pageSize,
                offset: offset,
                distinct: true,
                order: [['name', 'ASC']]
            });

            if (count === 0) {
                return res.status(404).json({
                    status: false,
                    msg: 'No Employees found'
                });
            }

            return res.status(200).json({
                status: true,
                data: employees,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / pageSize)
            });
        } catch (error) {
            console.error('Error in fetch all employee:', error);
            return res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
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
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Designations,
                        as: 'Designation',
                        attributes: ['id', 'name', 'type', 'notice_period']
                    },
                    {
                        model: Departments,
                        as: 'Department',
                        attributes: ['id', 'name']
                    },
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

    async deleteEmployee(req, res) {
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

    async deleteEmployeeDocument(req, res) {
        try {
            const { id } = req.params;

            const document = await EmployeeDocuments.findOne({ where: { id } });

            if (!document) {
                return res.status(404).json({
                    status: false,
                    errors: ['Document not found']
                });
            }

            await document.destroy();

            return res.status(200).json({
                status: true,
                msg: ' Document deleted successfully'
            });
        } catch (err) {
            console.error('Error in delete:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getAllEmployeeTL(req, res) {
        try {
            const designations = await EmployeeRepo.getTeamleadId();
            const whereClause = { status: 1 };

            whereClause.designation = {
                [Op.in]: designations
            };

            if (req.query.name !== undefined) {
                whereClause[Op.or] = [
                    { '$Employees.full_name$': { [Sequelize.Op.iLike]: `%${req.query.name}%` } },
                    { '$Employees.employee_no$': { [Sequelize.Op.iLike]: `%${req.query.name}%` } }
                ];
            }

            const emp = await Employees.findOne({ attributes: ['id'], where: { user_id: req.user.userId } });
            if (emp) {
                if (req.userRole?.type != 'hr') {
                    whereClause[Op.or] = [
                        { teamlead: { [Op.in]: await getEmployeeHierarchy(emp?.id) } },
                        { id: emp.id }
                    ];
                }
            }

            const employees = await Employees.findAll({
                attributes: ['id', 'employee_no', 'name', 'mname', 'lname', 'email'],
                where: whereClause,
                order: [['name', 'ASC']]
            });

            if (employees.count === 0) {
                return res.status(404).json({
                    status: false,
                    msg: 'No Employees found'
                });
            }

            res.status(200).json({
                status: true,
                data: employees
            });
        } catch (error) {
            console.error('Error in fetch all employee:', error);
            res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }

    async getExcel(req, res) {
        try {
            const whereClause = { status: 1 };

            if (req.query.name) {
                whereClause[Op.or] = [
                    { full_name: { [Op.iLike]: `%${req.query.name}%` } },
                    { employee_no: { [Op.iLike]: `%${req.query.name}%` } }
                ];
            }

            if (req.query.department) {
                whereClause.department = req.query.department;
            }

            if (req.query.designation) {
                whereClause.designation = req.query.designation;
            }

            if (req.query.teamlead) {
                whereClause.teamlead = req.query.teamlead;
            }

            if (req.query.status) {
                whereClause.status = req.query.status;
            }

            const employees = await Employees.findAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Designations,
                        as: 'Designation',
                        attributes: ['id', 'name', 'type', 'notice_period']
                    },
                    {
                        model: Departments,
                        as: 'Department',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['employee_no', 'ASC']]
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Employee Data');

            worksheet.columns = [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Employee No', key: 'employee_no', width: 15 },
                { header: 'Department', key: 'department', width: 20 },
                { header: 'Designation', key: 'designation', width: 20 },
                { header: 'Team Lead', key: 'teamlead', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Mobile', key: 'mobile', width: 20 },
                { header: 'DOJ', key: 'doj', width: 15 },
                { header: 'Status', key: 'status', width: 10 }
            ];

            employees.forEach((emp) => {
                const teamleadName =
                    emp.TeamLead?.name +
                    (emp.TeamLead?.mname ? ' ' + emp.TeamLead?.mname : '') +
                    (emp.TeamLead?.lname ? ' ' + emp.TeamLead?.lname : '');

                worksheet.addRow({
                    name: emp.full_name,
                    employee_no: emp.employee_no,
                    department: emp.Department?.name || '',
                    designation: emp.Designation?.name || '',
                    teamlead: teamleadName || '',
                    email: emp.email || '',
                    mobile: emp.mobile || '',
                    doj: emp.doj ? formatDate(emp.doj) : '',
                    status: emp.status === 1 ? 'Active' : 'Inactive'
                });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=employee_data.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting employees to Excel:', error);
            res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }
}

module.exports = employeeController;
