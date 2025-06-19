const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');
const User = require('./user');

const Employee = sequelize.define(
    'Employee',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        blood_group: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);

Employee.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Employee;
