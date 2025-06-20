const sequelize = require('../src/database/db');

const User = require('./user');
const Employee = require('./employee');
const EmployeeDocument = require('./employeeDocument');

Employee.belongsTo(User, { foreignKey: 'user_id' });

Employee.hasMany(EmployeeDocument, {
    foreignKey: 'employee_id',
    as: 'documents',
    onDelete: 'CASCADE'
});

EmployeeDocument.belongsTo(Employee, {
    foreignKey: 'employee_id'
});

const db = {
    sequelize,
    User,
    Employee,
    EmployeeDocument
};

module.exports = db;
