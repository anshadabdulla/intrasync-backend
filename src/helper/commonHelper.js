const { sequelize } = require('../../models');

const generatePattern = (prefix, number) => {
    let paddedNumber = String(number).padStart(4, '0');
    return `${prefix}${paddedNumber}`;
};

const getEmployeeHierarchy = async (employeeId) => {
    const query = `
    WITH RECURSIVE employee_hierarchy AS (
        SELECT id, teamlead, 1 as depth
        FROM "Employees"
        WHERE id = :employeeId
        UNION ALL
        SELECT e.id, e.teamlead, eh.depth + 1
        FROM "Employees" e
        INNER JOIN employee_hierarchy eh ON eh.id = e.teamlead
        WHERE eh.depth < 10 
    ) SELECT id
    FROM employee_hierarchy;`;

    try {
        const results = await sequelize.query(query, {
            replacements: { employeeId },
            type: sequelize.QueryTypes.SELECT,
            raw: true
        });

        const ids = [...new Set(results.map((row) => row.id))];
        return ids;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

module.exports = {
    generatePattern,
    getEmployeeHierarchy
};
