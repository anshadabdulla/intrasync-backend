'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'reset_flag', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        });
        await queryInterface.addColumn('Users', 'last_login', {
            type: Sequelize.DATE,
            allowNull: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'reset_flag');
        await queryInterface.removeColumn('Users', 'last_login');
    }
};
