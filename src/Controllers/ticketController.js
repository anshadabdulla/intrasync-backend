const { validationResult } = require('express-validator');
const TicketRepo = require('../repository/ticketRepo');
const { Op, Sequelize } = require('sequelize');
const { Tickets, Employees, Departments, Designations, Ticket_details } = require('../../models');
const ExcelJS = require('exceljs');

class ticketController {
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

            const isDuplicate = await TicketRepo.checkDuplication({ title });

            if (isDuplicate) {
                return res.status(400).json({
                    status: false,
                    msg: 'Ticket with this title already exists.'
                });
            }
            console.log('!!!!!', req.user);
            const response = await TicketRepo.create(req.body, req.user.userId);

            if (response) {
                return res.status(200).json({
                    status: true,
                    msg: 'Ticket created successfully!'
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

            const existing = await Tickets.findByPk(id);
            if (!existing) {
                return res.status(404).json({
                    status: false,
                    errors: ['Ticket not found']
                });
            }

            const duplicate = await TicketRepo.checkDuplication({ title });
            if (duplicate && duplicate.id != id) {
                return res.status(400).json({
                    status: false,
                    errors: ['Another ticket with the same title already exists']
                });
            }

            const response = await TicketRepo.update(id, req.body, req.user.userId);

            if (response) {
                return res.status(200).json({
                    status: true,
                    msg: 'Ticket updated successfully!'
                });
            } else {
                return res.status(400).json({
                    status: false,
                    msg: 'Ticket cannot be updated due to status or permissions'
                });
            }
        } catch (err) {
            console.error('Error updating ticket:', err);
            return res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }

    async getAllTickets(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * pageSize;

            const whereClause = {};

            if (req.query.search) {
                whereClause[Op.or] = [
                    { title: { [Sequelize.Op.iLike]: `%${req.query.search}%` } },
                    { ticket_id: { [Sequelize.Op.iLike]: `%${req.query.search}%` } }
                ];
            }

            if (req.query.created_by) {
                whereClause.created_by = req.query.created_by;
            }

            if (req.query.status) {
                whereClause.status = req.query.status;
            }

            if (req.query.category) {
                whereClause.category = req.query.category;
            }

            if (req.query.priority) {
                whereClause.priority = req.query.priority;
            }

            let { count, rows: result } = await Tickets.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'assignedTo',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'CreatedBy',
                        include: [
                            {
                                model: Departments,
                                as: 'Department',
                                attributes: ['id', 'name']
                            },
                            {
                                model: Designations,
                                as: 'Designation',
                                attributes: ['id', 'name', 'type', 'notice_period']
                            }
                        ]
                    }
                ],
                limit: pageSize,
                offset: offset,
                distinct: true,
                order: [['id', 'DESC']]
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

    async getSingleTicket(req, res) {
        try {
            const id = req.params.id;
            const result = await Tickets.findOne({
                where: { id },
                include: [
                    {
                        model: Employees,
                        as: 'assignedTo',
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Employees,
                        as: 'CreatedBy',
                        attributes: ['id', 'name', 'mname', 'lname', 'employee_no']
                    },
                    {
                        model: Employees,
                        as: 'CreatedBy',
                        include: [
                            {
                                model: Departments,
                                as: 'Department',
                                attributes: ['id', 'name']
                            },
                            {
                                model: Designations,
                                as: 'Designation',
                                attributes: ['id', 'name', 'type', 'notice_period']
                            }
                        ]
                    },
                    {
                        model: Ticket_details,
                        as: 'details',
                        include: [
                            {
                                model: Employees,
                                as: 'updatedBy',
                                attributes: ['id', 'name', 'mname', 'lname', 'employee_no']
                            }
                        ]
                    }
                ],
                order: [[{ model: Ticket_details, as: 'details' }, 'createdAt', 'ASC']]
            });
            if (!result) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            res.status(200).json({
                status: true,
                data: result
            });
        } catch (error) {
            console.error('getSingleTicket: ' + error);
            res.status(500).json({
                status: false,
                error: 'Internal Server Error'
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const ticket = await Tickets.findByPk(id);

            if (!ticket) {
                return res.status(404).json({
                    status: false,
                    errors: ['Ticket not found']
                });
            }
            if (ticket.status == 0) {
                await ticket.destroy();
                return res.status(200).json({
                    status: true,
                    msg: 'Tickets deleted successfully!'
                });
            } else {
                return res.status(200).json({
                    status: false,
                    msg: 'Sorry! You can only delete pending tickets'
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                errors: [error.message || 'Internal Server Error']
            });
        }
    }

    async getTicketsExcel(req, res) {
        try {
            const whereClause = {};

            if (req.query.search) {
                whereClause[Op.or] = [
                    { title: { [Op.iLike]: `%${req.query.search}%` } },
                    { ticket_id: { [Op.iLike]: `%${req.query.search}%` } }
                ];
            }

            if (req.query.created_by) {
                whereClause.created_by = req.query.created_by;
            }

            if (req.query.status) {
                whereClause.status = req.query.status;
            }

            if (req.query.category) {
                whereClause.category = req.query.category;
            }

            if (req.query.priority) {
                whereClause.priority = req.query.priority;
            }

            const tickets = await Tickets.findAll({
                where: whereClause,
                include: [
                    {
                        model: Employees,
                        as: 'assignedTo',
                        attributes: ['employee_no', 'name', 'mname', 'lname', 'email']
                    },
                    {
                        model: Employees,
                        as: 'CreatedBy',
                        include: [
                            {
                                model: Departments,
                                as: 'Department',
                                attributes: ['name']
                            },
                            {
                                model: Designations,
                                as: 'Designation',
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                order: [['id', 'DESC']]
            });

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Tickets');

            worksheet.columns = [
                { header: 'Ticket ID', key: 'ticket_id', width: 15 },
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Category', key: 'category', width: 15 },
                { header: 'Priority', key: 'priority', width: 12 },
                { header: 'Status', key: 'status', width: 12 },
                { header: 'Created By', key: 'created_by', width: 25 },
                { header: 'Department', key: 'department', width: 20 },
                { header: 'Designation', key: 'designation', width: 20 },
                { header: 'Assigned To', key: 'assigned_to', width: 25 },
                { header: 'Created At', key: 'created_at', width: 20 }
            ];

            tickets.forEach((ticket) => {
                const createdBy = ticket.CreatedBy;
                const assigned = ticket.assignedTo;

                const createdByName = `${createdBy?.name || ''} ${createdBy?.mname || ''} ${
                    createdBy?.lname || ''
                }`.trim();
                const assignedToName = `${assigned?.name || ''} ${assigned?.mname || ''} ${
                    assigned?.lname || ''
                }`.trim();

                worksheet.addRow({
                    ticket_id: ticket.ticket_id,
                    title: ticket.title,
                    category: ticket.category,
                    priority: ticket.priority,
                    status: ticket.status,
                    created_by: createdByName,
                    department: createdBy?.Department?.name || '',
                    designation: createdBy?.Designation?.name || '',
                    assigned_to: assignedToName,
                    created_at: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ''
                });
            });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=tickets_data.xlsx');

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error exporting tickets to Excel:', error);
            res.status(500).json({
                status: false,
                msg: 'Internal Server Error'
            });
        }
    }

    async getMyTickets(req, res) {
        try {
            const userId = req.user.userId;
            const tickets = await Tickets.findAll({
                where: { created_by: userId },
                order: [['createdAt', 'DESC']]
            });

            res.json({ status: true, data: tickets });
        } catch (error) {
            res.status(500).json({ status: false, msg: 'Something went wrong' });
        }
    }
}

module.exports = ticketController;
