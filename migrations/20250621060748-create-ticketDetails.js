'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TicketDetails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ticket_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            comment: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            updated_by: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            status: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            file: {
                allowNull: true,
                type: Sequelize.STRING
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
        await queryInterface.dropTable('TicketDetails');
    }
};
