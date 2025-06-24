'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Employees', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            employee_no: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            mname: {
                allowNull: true,
                type: Sequelize.STRING
            },
            lname: {
                allowNull: true,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            blood_group: {
                allowNull: true,
                type: Sequelize.STRING
            },
            mobile: {
                allowNull: false,
                type: Sequelize.STRING
            },
            doj: {
                allowNull: true,
                type: Sequelize.DATEONLY
            },
            residential_address: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            permenent_address: {
                allowNull: false,
                type: Sequelize.TEXT
            },
            gender: {
                allowNull: false,
                type: Sequelize.STRING
            },
            department: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            designation: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            teamlead: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            status: {
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
        await queryInterface.dropTable('Employees');
    }
};
