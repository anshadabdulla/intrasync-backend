'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ticket_id: {
                allowNull: true,
                type: Sequelize.STRING
            },
            title: {
                allowNull: true,
                type: Sequelize.STRING
            },
            category: {
                allowNull: true,
                type: Sequelize.STRING
            },
            priority: {
                allowNull: false,
                type: Sequelize.STRING
            },
            assigned_to: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            created_by: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            file: {
                allowNull: true,
                type: Sequelize.STRING
            },
            reason: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            status: {
                allowNull: false,
                defaultValue: 0,
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
        await queryInterface.dropTable('Tickets');
    }
};
