'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Settings', [
            {
                key: 'last-ticket-id',
                value: '1000',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                key: 'ticket-prefix',
                value: 'TCK',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('Settings', {
            key: ['last-ticket-id', 'ticket-prefix']
        });
    }
};
