const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Departments = sequelize.define(
    'Departments',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);

module.exports = Departments;
