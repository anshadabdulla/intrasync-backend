const { validationResult } = require('express-validator');
const TicketRepo = require('../repository/ticketRepo');

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

            const response = await TicketRepo.update(id, req.body);
            if (response) {
                return res.status(200).json({
                    status: true,
                    msg: 'Ticket updated successfully!'
                });
            } else {
                return res.status(500).json({
                    status: false,
                    msg: 'Something went wrong while updating the ticket'
                });
            }
        } catch (err) {
            console.error('Error updating ticket:', err);
            return res.status(500).json({
                status: false,
                msg: 'Something went wrong'
            });
        }
    }

    async getAllTickets(req, res) {
        try {
            const page = req.query.page || 1;
            const pageSize = req.query.pageSize || 10;

            const offset = (page - 1) * pageSize;
            const whereClause = {};

            if (req.query.search !== undefined) {
                whereClause[Sequelize.Op.or] = [
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Tickets.title')),
                        'LIKE',
                        `%${req.query.search.toLowerCase()}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Tickets.ticket_id')),
                        'LIKE',
                        `%${req.query.search.toLowerCase()}%`
                    )
                ];
            }

            let employee;
            if (req.user.user_type != 'admin') {
                employee = await Employees.findOne({
                    where: { user_id: req.userId },
                    attributes: ['id', 'department']
                });
                if (req.query.type) {
                    if (req.query.type == 1) {
                        whereClause.created_by = employee.id;
                    } else if (req.query.type == 2) {
                        whereClause[Sequelize.Op.or] = [
                            { assigned_to: employee.id },
                            { '$category.department_id$': employee.department }
                        ];
                    }
                } else {
                    whereClause[Sequelize.Op.or] = [
                        { created_by: employee.id },
                        { assigned_to: employee.id },
                        { '$category.department_id$': employee.department }
                    ];
                }
            }

            if (req.query.department_id) {
                whereClause['$category.department_id$'] = req.query.department_id;
            }

            if (req.query.category_id) {
                whereClause.category_id = req.query.category_id;
            }

            if (req.query.sub_category_id) {
                whereClause.sub_category_id = req.query.sub_category_id;
            }

            if (req.query.created_by) {
                whereClause.created_by = req.query.created_by;
            }

            if (req.query.asset_id) {
                whereClause.asset_id = req.query.asset_id;
            }

            if (req.query.status) {
                whereClause.status = req.query.status;
            }

            let result = await Tickets.findAndCountAll({
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
                        attributes: ['id', 'employee_no', 'email', 'name', 'mname', 'lname']
                    },
                    {
                        model: Departments,
                        as: 'assigned_dept',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Categories,
                        as: 'category',
                        required: false,
                        attributes: ['id', 'name', 'department_id'],
                        include: [
                            {
                                model: Departments,
                                as: 'department',
                                attributes: ['id', 'name', 'email']
                            }
                        ]
                    },
                    {
                        model: Categories,
                        as: 'sub_category',
                        attributes: ['id', 'name']
                    }
                ],
                limit: pageSize,
                offset: offset,
                distinct: true,
                order: [['id', 'DESC']]
            });

            const modifiedRows = await Promise.all(
                result.rows.map(async (element) => {
                    try {
                        const signedUrl = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: element.file
                        });
                        element.file = signedUrl;

                        if (employee) {
                            if (element.created_by === employee.id) {
                                element.dataValues.type = 1;
                            } else if (
                                element.category &&
                                element.category.department &&
                                element.category.department.id === employee.department
                            ) {
                                element.dataValues.type = 2;
                            }
                        }

                        return element;
                    } catch (error) {
                        console.error(`Error updating image URL for ${element.file}:`, error);
                        return element;
                    }
                })
            );

            res.status(200).json({
                status: true,
                data: {
                    count: result.count,
                    rows: modifiedRows
                },
                total: result.count,
                currentPage: page,
                totalPages: Math.ceil(result.count / pageSize)
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
                        model: Categories,
                        as: 'category',
                        attributes: ['id', 'name', 'is_it', 'department_id'],
                        include: [
                            {
                                model: Departments,
                                as: 'department',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        model: Categories,
                        as: 'sub_category',
                        attributes: ['id', 'name']
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
                    },
                    {
                        model: Ticket_assets,
                        as: 'ticket_assets',
                        include: [
                            {
                                model: Assets,
                                as: 'assets',
                                attributes: ['id', 'company_asset_code'],
                                include: [
                                    {
                                        model: Categories,
                                        as: 'Asset_categories',
                                        attributes: ['id', 'name']
                                    },
                                    {
                                        model: Asset_brands,
                                        as: 'Asset_brands',
                                        attributes: ['id', 'name']
                                    },
                                    {
                                        model: Asset_racks,
                                        as: 'rack',
                                        attributes: ['id', 'name', 'code']
                                    },
                                    {
                                        model: Asset_rooms,
                                        as: 'room',
                                        attributes: ['id', 'name', 'code']
                                    }
                                ]
                            }
                        ]
                    }
                    // {
                    //     model: Assets,
                    //     as: 'asset',
                    //     attributes: ['id', 'company_asset_code'],
                    //     include: [
                    //         {
                    //             model: Categories,
                    //             as: 'Asset_categories',
                    //             attributes: ['id','name']
                    //         },
                    //         {
                    //             model: Asset_brands,
                    //             as: 'Asset_brands',
                    //             attributes: ['id','name']
                    //         },
                    //         {
                    //             model: Asset_racks,
                    //             as: 'rack',
                    //             attributes: ['id','name','code']
                    //         }
                    //     ]
                    // }
                ],
                order: [[{ model: Ticket_details, as: 'details' }, 'createdAt', 'ASC']]
            });
            if (!result) {
                return res.status(404).json({ error: 'Ticket not found' });
            }

            if (result.file) {
                result.file = s3.getSignedUrl('getObject', {
                    Bucket: bucketName,
                    Key: result.file
                });
            }

            if (result?.details) {
                result.details.forEach((detail) => {
                    if (detail.file) {
                        detail.file = s3.getSignedUrl('getObject', {
                            Bucket: bucketName,
                            Key: detail.file
                        });
                    }
                });
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
}

function getTicketStatus(status) {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Resolved';
        case 2:
            return 'Reject';
        case 3:
            return 'On Hold';
        case 4:
            return 'Revoked';
        default:
            return '';
    }
}

module.exports = ticketController;
