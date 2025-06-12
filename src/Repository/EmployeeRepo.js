const Employee = require('../../models/employee');

class EmployeeRepo {
    async create(user, employeeData) {
        try {
            const employee = await Employee.create({
                user_id: user.id,
                employee_no: employeeData.employee_no,
                name: employeeData.name,
                mname: employeeData.mname,
                lname: employeeData.lname,
                email: employeeData.email,
                status: 1
            });
            return employee;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EmployeeRepo();
