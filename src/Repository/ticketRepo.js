const Tickets = require('../../models/Tickets');
const Employees = require('../../models/Employees');
const TicketDetails = require('../../models/TicketDetails');
const Settings = require('../../models/Settings');
const sequelize = require('../database/db');
const { generatePattern, getTicketStatus } = require('../helper/commonHelper');
const { Users } = require('../../models');

class TicketRepo {
    async checkDuplication({ title }) {
        try {
            return await Tickets.findOne({ where: { title: title } });
        } catch (error) {
            throw error;
        }
    }

    async create(data, userId) {
        const transaction = await sequelize.transaction();

        try {
            const employee = await Employees.findOne({ where: { user_id: userId } });

            const tickets = await Tickets.create(
                {
                    title: data.title,
                    category: data.category,
                    priority: data.priority,
                    assigned_to: data.assigned_to || null,
                    created_by: employee ? employee.id : null,
                    description: data.description || null,
                    file: data.fileUrl || null,
                    status: 0
                },
                { transaction }
            );

            await TicketDetails.create({
                ticket_id: tickets.id,
                comment: data.description,
                status: 0
            });

            const setting = await Settings.findOne({ where: { key: 'last-ticket-id' }, transaction });
            const setting1 = await Settings.findOne({ where: { key: 'ticket-prefix' }, transaction });

            tickets.ticket_id = generatePattern(setting1.value, parseInt(setting.value) + 1);
            await tickets.save({ transaction });

            setting.value = parseInt(setting.value) + 1;
            await setting.save({ transaction });

            await transaction.commit();

            return tickets;
        } catch (error) {
            if (transaction.finished !== 'commit') {
                await transaction.rollback();
            }
            console.log('error', error);
            throw error;
        }
    }

    async update(ticketId, data, userId) {
        const transaction = await sequelize.transaction();
        const employee = await Employees.findOne({ where: { user_id: userId } });

        try {
            const ticket = await Tickets.findByPk(ticketId, { transaction });
            const user = await Users.findByPk(userId);
            const isHR = user.user_type?.toLowerCase() === 'hr';

            if (!isHR && ticket.status !== 0) {
                await transaction.rollback();
                return null;
            }

            ticket.title = data.title;
            ticket.category = data.category || null;
            ticket.priority = data.priority || null;
            ticket.assigned_to = data.assigned_to || null;
            ticket.description = data.description || null;
            ticket.file = data.fileUrl || ticket.file;
            ticket.status = data.status;

            await ticket.save({ transaction });

            await TicketDetails.create(
                {
                    ticket_id: ticketId,
                    comment: `Ticket updated by user ${userId} (Status: ${getTicketStatus(ticket.status)})`,
                    status: ticket.status,
                    updated_by: employee.id
                },
                { transaction }
            );

            await transaction.commit();
            return ticket;
        } catch (error) {
            if (transaction.finished !== 'commit') {
                await transaction.rollback();
            }
            throw error;
        }
    }
}

module.exports = new TicketRepo();
