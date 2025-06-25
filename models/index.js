const sequelize = require('../src/database/db');
const EmployeeDocuments = require('./employeeDocuments');
const Employees = require('./employees');
const Users = require('./users');
const Tickets = require('./tickets');
const Ticket_details = require('./ticketDetails');
const Designations = require('./designations');
const Departments = require('./departments');

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

Employees.belongsTo(Employees, {
    foreignKey: 'teamlead',
    as: 'TeamLead'
});

Employees.hasMany(Employees, {
    foreignKey: 'teamlead',
    as: 'TeamMembers'
});

Employees.belongsTo(Designations, {
    foreignKey: 'designation',
    as: 'Designation'
});

Designations.hasMany(Employees, {
    foreignKey: 'designation',
    as: 'Employees'
});

Employees.belongsTo(Departments, {
    foreignKey: 'department',
    as: 'Department'
});

Departments.hasMany(Employees, {
    foreignKey: 'department',
    as: 'Employees'
});

Employees.addHook('beforeCreate', (employee, options) => {
    employee.full_name = [employee.name, employee.mname, employee.lname].filter(Boolean).join(' ');
});

Employees.addHook('beforeUpdate', (employee, options) => {
    employee.full_name = [employee.name, employee.mname, employee.lname].filter(Boolean).join(' ');
});

const db = {
    sequelize,
    Users,
    Employees,
    EmployeeDocuments,
    Tickets,
    Ticket_details,
    Designations,
    Departments
};

module.exports = db;
