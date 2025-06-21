const sequelize = require('../src/database/db');
const EmployeeDocuments = require('./employeeDocuments');
const Employees = require('./employees');
const Users = require('./users');
const Tickets = require('./tickets');
const Ticket_details = require('./ticketDetails');

Employees.belongsTo(Users, {
    foreignKey: 'user_id'
});

Employees.hasMany(EmployeeDocuments, {
    foreignKey: 'employee_id',
    as: 'documents',
    onDelete: 'CASCADE'
});

EmployeeDocuments.belongsTo(Employees, {
    foreignKey: 'employee_id'
});

Tickets.belongsTo(Employees, {
    foreignKey: 'assigned_to',
    as: 'assignedTo'
});

Tickets.belongsTo(Employees, {
    foreignKey: 'created_by',
    as: 'CreatedBy'
});

Tickets.hasMany(Ticket_details, {
    foreignKey: 'ticket_id',
    as: 'details'
});

Ticket_details.belongsTo(Employees, {
    foreignKey: 'updated_by',
    as: 'updatedBy'
});

const db = {
    sequelize,
    Users,
    Employees,
    EmployeeDocuments,
    Tickets,
    Ticket_details
};

module.exports = db;
