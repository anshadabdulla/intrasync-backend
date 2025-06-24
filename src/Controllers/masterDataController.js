const { validationResult } = require('express-validator');
const { Departments, Designations } = require('../../models');
const MasterDataRepo = require('../repository/MasterDataRepo');
const { where } = require('sequelize');

class masterDataController {
    async createDepartment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }
            const { name } = req.body;
            const existingDepartment = await Departments.findOne({ where: { name } });

            if (existingDepartment) {
                return res.status(400).json({
                    status: false,
                    errors: ['Department already exists']
                });
            }

            const department = await MasterDataRepo.createDepartment(req.body);

            if (department) {
                return res.status(200).json({
                    status: true,
                    msg: 'Departments created successfully'
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
    async updateDepartment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }
            const { id } = req.params;
            const department = await MasterDataRepo.updateDepartment(req.body, id);

            if (!department) {
                return res.status(404).json({
                    status: false,
                    errors: ['department not found']
                });
            }

            return res.status(200).json({
                status: true,
                msg: 'department updated successfully'
            });
        } catch (err) {
            console.error('Error in update:', err);
            res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }
    async deleteDepartment(req, res) {
        try {
            const { id } = req.params;

            const department = await Departments.findOne({ where: { id } });

            if (!department) {
                return res.status(404).json({
                    status: false,
                    errors: ['Department not found']
                });
            }

            await department.destroy();

            return res.status(200).json({
                status: true,
                msg: ' Department deleted successfully'
            });
        } catch (err) {
            console.error('Error in delete:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getDepartmentById(req, res) {
        try {
            const { id } = req.params;

            const department = await Departments.findOne({ where: { id } });

            if (!department) {
                return res.status(404).json({
                    status: false,
                    errors: ['Departments not found']
                });
            }

            return res.status(200).json({
                status: true,
                data: department
            });
        } catch (err) {
            console.error('Error in getEmployeeById:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getAllDepartment(req, res) {
        try {
            const department = await Departments.findAll({});

            if (!department) {
                return res.status(404).json({
                    status: false,
                    errors: ['Departments not found']
                });
            }

            return res.status(200).json({
                status: true,
                data: department
            });
        } catch (err) {
            console.error('Error in getEmployeeById:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async createDesignation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }
            const { name } = req.body;
            const existingDesignation = await Designations.findOne({ where: { name } });

            if (existingDesignation) {
                return res.status(400).json({
                    status: false,
                    errors: ['Designation already exists']
                });
            }

            const designation = await MasterDataRepo.createDesignation(req.body);

            if (designation) {
                return res.status(200).json({
                    status: true,
                    msg: 'Designation created successfully'
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

    async updateDesignation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }
            const { id } = req.params;
            const designation = await MasterDataRepo.updateDesignation(req.body, id);

            if (!designation) {
                return res.status(404).json({
                    status: false,
                    errors: ['Designation not found']
                });
            }

            return res.status(200).json({
                status: true,
                msg: 'Designation updated successfully'
            });
        } catch (err) {
            console.error('Error in update:', err);
            res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async deleteDesignation(req, res) {
        try {
            const { id } = req.params;

            const designation = await Designations.findOne({ where: { id } });

            if (!designation) {
                return res.status(404).json({
                    status: false,
                    errors: ['Designation not found']
                });
            }

            await designation.destroy();

            return res.status(200).json({
                status: true,
                msg: ' Designation deleted successfully'
            });
        } catch (err) {
            console.error('Error in delete:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getDesignationById(req, res) {
        try {
            const { id } = req.params;

            const designation = await Designations.findOne({ where: { id } });

            if (!designation) {
                return res.status(404).json({
                    status: false,
                    errors: ['Designation not found']
                });
            }

            return res.status(200).json({
                status: true,
                data: designation
            });
        } catch (err) {
            console.error('Error in getEmployeeById:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getAllDesignation(req, res) {
        try {
            const designation = await Designations.findAll({});

            if (!designation) {
                return res.status(404).json({
                    status: false,
                    errors: ['Designation not found']
                });
            }

            return res.status(200).json({
                status: true,
                data: designation
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

module.exports = masterDataController;
