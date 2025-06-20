'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const EmployeeDocument = sequelize.define(
    'EmployeeDocument',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        timestamps: true,
        paranoid: true
    }
);

module.exports = EmployeeDocument;
