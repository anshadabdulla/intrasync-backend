const Tickets = require('../../models/Tickets');
const Employees = require('../../models/Employees');
const TicketDetails = require('../../models/TicketDetails');
const Settings = require('../../models/Settings');
const sequelize = require('../database/db');

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
        try {
            let fileUrl = '';
            if (data.file !== '') {
                const buffer = Buffer.from(data.file.split(',')[1], 'base64');
                const readableStream = new Readable();
                readableStream._read = () => {};
                readableStream.push(buffer);
                readableStream.push(null);

                const uploadParams = {
                    Bucket: bucketName,
                    Body: readableStream,
                    Key: 'zync/ticketing/' + Date.now() + data.filename,
                    ACL: 'public-read'
                };

                const uploadResult = await s3.upload(uploadParams).promise();
                fileUrl = uploadResult.Key;
            }

            const ticket = await Tickets.findByPk(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            ticket.title = data.title;
            ticket.category_id = data.category_id || null;
            (ticket.sub_category_id = data.sub_category_id || null),
                // ticket.asset_id				= data.asset_id || null,
                (ticket.priority = data.priority || null);
            ticket.assigned_to = data.assigned_to || null;
            ticket.dept_assigned_to = data.dept_assigned_to || null;
            ticket.description = data.description || null;
            ticket.file = fileUrl || ticket.file;
            ticket.cc = data.email || ticket.cc;

            await ticket.save();

            let insertData = [];
            Ticket_assets.destroy({ where: { ticket_id: ticketId } });
            data?.asset_id?.length &&
                data?.asset_id.forEach((id) => {
                    insertData.push({
                        ticket_id: ticketId,
                        asset_id: id
                    });
                });

            Ticket_assets.bulkCreate(insertData);

            return ticket;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TicketRepo;
