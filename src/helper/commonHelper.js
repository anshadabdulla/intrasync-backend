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

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
}

function getTicketStatus(status) {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Resolved';
        case 2:
            return 'Reject';
        case 3:
            return 'On Hold';
        case 4:
            return 'Revoked';
        default:
            return '';
    }
}

module.exports = {
    generatePattern,
    getEmployeeHierarchy,
    formatDate,
    getTicketStatus
};
