const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Settings = sequelize.define(
    'Settings',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        timestamps: true,
        paranoid: true
    }
);

module.exports = Settings;
