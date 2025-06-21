const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const TicketDetails = sequelize.define(
    'TicketDetails',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        ticket_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER, // 0 - pending , 1 - resolved , 2 - reject , 3 - on hold, 4 - revoked
            allowNull: true
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);

module.exports = TicketDetails;
