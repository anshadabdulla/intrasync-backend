const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Employees = sequelize.define(
    'Employees',
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
        blood_group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);

module.exports = Employees;
