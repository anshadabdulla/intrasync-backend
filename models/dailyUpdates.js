const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const DailyUpdates = sequelize.define('DailyUpdates', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING
    },
    date: {
        allowNull: true,
        type: DataTypes.DATEONLY
    },
    start_time: {
        allowNull: true,
        type: DataTypes.TIME
    },
    end_time: {
        allowNull: true,
        type: DataTypes.TIME
    },
    total_time: {
        allowNull: true,
        type: DataTypes.TIME
    },
    description: {
        allowNull: true,
        type: DataTypes.TEXT
    },
    teamlead: {
        allowNull: true,
        type: DataTypes.INTEGER
    },
    created_by: {
        allowNull: true,
        type: DataTypes.INTEGER
    }
});

module.exports = DailyUpdates;
