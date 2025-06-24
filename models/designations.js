const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Designations = sequelize.define(
    'Designations',
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
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notice_period: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);
module.exports = Designations;
