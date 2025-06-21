const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Settings = sequelize.define(
    'Settings',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        key: {
            allowNull: false,
            type: DataTypes.STRING
        },
        value: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        status: {
            allowNull: false,
            defaultValue: 1,
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: true,
        paranoid: true
    }
);

module.exports = Settings;
