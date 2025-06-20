const sequelize = require('../src/database/db');
const EmployeeDocuments = require('./employeeDocuments');
const Employees = require('./employees');
const Users = require('./users');

Employee.belongsTo(Users, { foreignKey: 'user_id' });

Employee.hasMany(EmployeeDocuments, {
    foreignKey: 'employee_id',
    as: 'documents',
    onDelete: 'CASCADE'
});

EmployeeDocument.belongsTo(Employees, {
    foreignKey: 'employee_id'
});

const db = {
    sequelize,
    Users,
    Employees,
    EmployeeDocuments
};

module.exports = db;
