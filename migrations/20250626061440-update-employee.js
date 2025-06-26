'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Employees', 'prefix', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'father_name', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'nationality', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'probation', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'emergency_phone', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'relation', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'ctc_salary', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'distance_from_office', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Employees', 'stay_in', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Employees', 'prefix');
        await queryInterface.removeColumn('Employees', 'father_name');
        await queryInterface.removeColumn('Employees', 'nationality');
        await queryInterface.removeColumn('Employees', 'probation');
        await queryInterface.removeColumn('Employees', 'emergency_phone');
        await queryInterface.removeColumn('Employees', 'relation');
        await queryInterface.removeColumn('Employees', 'ctc_salary');
        await queryInterface.removeColumn('Employees', 'distance_from_office');
        await queryInterface.removeColumn('Employees', 'stay_in');
    }
};
