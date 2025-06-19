const Employee = require('../../models/employee');
const User = require('../../models/user');

class EmployeeRepo {
    async create(employeeData) {
        try {
            const user = await User.create({
                username: employeeData.employee_no,
                password: 'login@123',
                user_type: 'employee',
                email: employeeData.email,
                status: 1
            });

            const employee = await Employee.create({
                user_id: user.id,
                employee_no: employeeData.employee_no,
                name: employeeData.name,
                mname: employeeData.mname || null,
                lname: employeeData.lname || null,
                email: employeeData.email,
                blood_group: employeeData.blood_group || null,
                photo: employeeData.photo || null,
                status: 1
            });

            return employee;
        } catch (error) {
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            const employee = await Employee.findOne({ where: { id } });
            if (!employee) return null;

            const user = await User.findOne({ where: { id: employee.user_id } });
            if (!user) return null;

            await user.update({
                username: updateData.employee_no,
                email: updateData.email
            });

            await employee.update({
                employee_no: updateData.employee_no,
                name: updateData.name,
                mname: updateData.mname || null,
                lname: updateData.lname || null,
                email: updateData.email,
                blood_group: updateData.blood_group || null,
                photo: updateData.photo || null,
                status: updateData.status ?? 1
            });

            return employee;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EmployeeRepo();
