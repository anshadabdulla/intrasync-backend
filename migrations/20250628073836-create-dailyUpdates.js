'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('DailyUpdates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING
            },
            date: {
                allowNull: true,
                type: Sequelize.DATEONLY
            },
            start_time: {
                allowNull: true,
                type: Sequelize.TIME
            },
            end_time: {
                allowNull: true,
                type: Sequelize.TIME
            },
            total_time: {
                allowNull: true,
                type: Sequelize.TIME
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            teamlead: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            created_by: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('DailyUpdates');
    }
};
