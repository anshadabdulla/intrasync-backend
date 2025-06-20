'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('EmployeeDocuments', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            employee_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: true
            },
            file: {
                type: Sequelize.STRING,
                allowNull: true
            },
            text: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('EmployeeDocuments');
    },
};