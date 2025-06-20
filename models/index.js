const sequelize = require('../src/database/db');
const EmployeeDocuments = require('./employeeDocuments');
const Employees = require('./employees');
const Users = require('./users');

Employees.belongsTo(Users, { foreignKey: 'user_id' });

Employees.hasMany(EmployeeDocuments, {
    foreignKey: 'employee_id',
    as: 'documents',
    onDelete: 'CASCADE'
});

EmployeeDocuments.belongsTo(Employees, {
    foreignKey: 'employee_id'
});

const db = {
    sequelize,
    Users,
    Employees,
    EmployeeDocuments
};

module.exports = db;
