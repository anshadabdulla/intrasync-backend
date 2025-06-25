'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Employees', 'full_name', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.sequelize.query(`
            UPDATE "Employees"
            SET "full_name" = TRIM(
                regexp_replace(
                    COALESCE("name", '') || ' ' || COALESCE("mname", '') || ' ' || COALESCE("lname", ''),
                    '\\s+', ' ', 'g'
                )
            )
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Employees', 'full_name');
    }
};
