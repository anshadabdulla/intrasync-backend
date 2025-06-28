const { validationResult } = require('express-validator');
const dailyUpdateRepo = require('../repository/dailyUpdateRepo');
const { Op, Sequelize } = require('sequelize');
const { Employees, DailyUpdates } = require('../../models');
const ExcelJS = require('exceljs');

class dailyUpdateController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    errors: errors.array().map((error) => error.msg)
                });
            }
            const { title } = req.body;

            const isDuplicate = await dailyUpdateRepo.checkDuplication({ title });

            if (isDuplicate) {
                return res.status(400).json({
                    status: false,
                    msg: 'Daily update with this title already exists.'
                });
            }
            const response = await dailyUpdateRepo.create(req.body, req.user.userId);

            if (response) {
                return res.status(200).json({
                    status: true,
                    msg: 'Created successfully!'
                });
            } else {
                return res.status(500).json({
                    status: false,
                    msg: 'Somthing went wrong!'
                });
            }
        } catch (err) {
            console.error('createTickets: ' + err);
            res.status(500).json({
                status: false,
                error: 'Internal Server Error'
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
            const { title } = req.body;

            const existing = await DailyUpdates.findByPk(id);
            if (!existing) {
                return res.status(404).json({
                    status: false,
                    errors: ['Daily update not found']
                });
            }

            const duplicate = await dailyUpdateRepo.checkDuplication({ title });
            if (duplicate && duplicate.id != id) {
                return res.status(400).json({
                    status: false,
                    errors: ['Daily update with this title already exists']
                });
            }

            req.body.created_by = req.user.userId;

            const response = await dailyUpdateRepo.update(id, req.body);

            return res.status(200).json({
                status: true,
                msg: 'Updated successfully!'
            });
        } catch (err) {
            console.error('Error updating daily update:', err);
            return res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }

    async getAllUpdates(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * pageSize;

            const whereClause = {};

            if (req.query.search) {
                whereClause[Op.or] = [{ title: { [Sequelize.Op.iLike]: `%${req.query.search}%` } }];
            }

            if (req.query.created_by) {
                whereClause.created_by = req.query.created_by;
            }

            if (req.query.teamlead) {
                whereClause.teamlead = req.query.teamlead;
            }
            if (req.query.start_date && req.query.end_date) {
                whereClause.date = {
                    [Op.between]: [req.query.start_date, req.query.end_date]
                };
            }

            let { count, rows: result } = await DailyUpdates.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'CreatedEmployee',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    }
                ],
                limit: pageSize,
                offset: offset,
                distinct: true,
                order: [['date', 'DESC']]
            });

            res.status(200).json({
                status: true,
                data: result,
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / pageSize)
            });
        } catch (err) {
            console.error('getAllTickets: ' + err);
            res.status(500).json({
                status: false,
                error: 'Internal Server Error'
            });
        }
    }

    async getSingleUpdate(req, res) {
        try {
            const id = req.params.id;
            const result = await DailyUpdates.findOne({
                where: { id },
                include: [
                    {
                        model: Employees,
                        as: 'CreatedEmployee',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    }
                ]
            });
            if (!result) {
                return res.status(404).json({ error: 'Daily update not found' });
            }

            res.status(200).json({
                status: true,
                data: result
            });
        } catch (error) {
            console.error('getSingleUpdate: ' + error);
            res.status(500).json({
                status: false,
                error: 'Internal Server Error'
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const update = await DailyUpdates.findByPk(id);

            if (!update) {
                return res.status(404).json({
                    status: false,
                    errors: ['Daily update not found']
                });
            }

            await update.destroy();

            return res.status(200).json({
                status: true,
                msg: 'Daily update deleted successfully'
            });
        } catch (err) {
            console.error('Error in delete:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async getDailyUpdateExcel(req, res) {
        try {
            const whereClause = {};

            if (req.query.search) {
                whereClause[Op.or] = [{ title: { [Sequelize.Op.iLike]: `%${req.query.search}%` } }];
            }

            if (req.query.created_by) {
                whereClause.created_by = req.query.created_by;
            }

            if (req.query.teamlead) {
                whereClause.teamlead = req.query.teamlead;
            }

            if (req.query.start_date && req.query.end_date) {
                whereClause.date = {
                    [Op.between]: [req.query.start_date, req.query.end_date]
                };
            }

            const dailyUpdates = await DailyUpdates.findAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'CreatedEmployee',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    }
                ],
                order: [['date', 'DESC']]
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Daily Updates');

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Start Time', key: 'start_time', width: 15 },
                { header: 'End Time', key: 'end_time', width: 15 },
                { header: 'Total Time', key: 'total_time', width: 15 },
                { header: 'Description', key: 'description', width: 30 },
                { header: 'Created By', key: 'created_by', width: 25 },
                { header: 'Team Lead', key: 'team_lead', width: 25 }
            ];

            dailyUpdates.forEach((update) => {
                const creator = update.CreatedEmployee;
                const lead = update.TeamLead;

                const createdByName = `${creator?.name || ''} ${creator?.mname || ''} ${creator?.lname || ''}`.trim();
                const teamLeadName = `${lead?.name || ''} ${lead?.mname || ''} ${lead?.lname || ''}`.trim();

                worksheet.addRow({
                    id: update.id,
                    title: update.title,
                    date: update.date,
                    start_time: update.start_time,
                    end_time: update.end_time,
                    total_time: update.total_time,
                    description: update.description,
                    created_by: createdByName,
                    team_lead: teamLeadName
                });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=daily_updates.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting daily updates to Excel:', error);
            res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }

    async getMyUpdate(req, res) {
        try {
            const userId = req.user.userId;
            const dailyUpdate = await DailyUpdates.findAll({
                where: { created_by: userId },

                include: [
                    {
                        model: Employees,
                        as: 'CreatedEmployee',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'TeamLead',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    }
                ],
                order: [['date', 'DESC']]
            });

            res.json({ status: true, data: dailyUpdate });
        } catch (error) {
            res.status(500).json({ status: false, msg: 'Something went wrong' });
        }
    }
}

module.exports = dailyUpdateController;
