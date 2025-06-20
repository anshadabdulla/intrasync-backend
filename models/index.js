const sequelize = require('../src/database/db');

const User = require('./user');
const Employee = require('./employee');
const EmployeeDocument = require('./employeeDocument');

Employee.belongsTo(User, { foreignKey: 'user_id' });

EmployeeDocument.belongsTo(Employee, {
    foreignKey: 'employee_id',
    onDelete: 'CASCADE'
});

const db = {
    sequelize,
    User,
    Employee,
    EmployeeDocument
};

module.exports = db;
