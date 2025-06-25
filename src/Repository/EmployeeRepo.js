const { Users, Employees, EmployeeDocuments, Designations } = require('../../models');
const { Op } = require('sequelize');

class EmployeeRepo {
    async create(employeeData) {
        try {
            const user = await Users.create({
                username: employeeData.employee_no,
                password: 'login@123',
                user_type: 'employee',
                email: employeeData.email,
                status: 1
            });

            const employee = await Employees.create({
                user_id: user.id,
                employee_no: employeeData.employee_no,
                name: employeeData.name,
                mname: employeeData.mname || null,
                lname: employeeData.lname || null,
                email: employeeData.email,
                blood_group: employeeData.blood_group || null,
                mobile: employeeData.mobile,
                doj: employeeData.doj || null,
                residential_address: employeeData.residential_address || null,
                permenent_address: employeeData.permenent_address,
                gender: employeeData.gender,
                department: employeeData.department || null,
                designation: employeeData.designation || null,
                teamlead: employeeData.teamlead || null,
                status: 1
            });

            return employee;
        } catch (error) {
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            const employee = await Employees.findOne({ where: { id } });
            if (!employee) return null;

            const user = await Users.findOne({ where: { id: employee.user_id } });
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
                mobile: updateData.mobile,
                doj: updateData.doj || null,
                residential_address: updateData.residential_address || null,
                permenent_address: updateData.permenent_address,
                gender: updateData.gender,
                department: updateData.department || null,
                designation: updateData.designation || null,
                teamlead: updateData.teamlead || null,
                status: updateData.status ?? 1
            });

            return employee;
        } catch (error) {
            throw error;
        }
    }

    async createDocument(documentData) {
        try {
            const created = await EmployeeDocuments.create({
                employee_id: documentData.employee_id,
                type: documentData.type,
                file: documentData.file,
                text: documentData.text,
                status: documentData.status ?? 1
            });

            return created;
        } catch (error) {
            throw error;
        }
    }

    async updateDocument(id, dataUpdate) {
        try {
            const updated = await EmployeeDocuments.findOne({ where: { id } });
            if (!updated) return null;

            await updated.update({
                employee_id: dataUpdate.employee_id,
                type: dataUpdate.type,
                file: dataUpdate.file,
                text: dataUpdate.text,
                status: dataUpdate.status ?? 1
            });

            return updated;
        } catch (error) {
            throw error;
        }
    }

    async getTeamleadId() {
        var teamlead = await Designations.findAll({
            where: {
                type: { [Op.ne]: 'employee' }
            }
        });
        const tlIds = teamlead.map((entry) => entry.id);
        return tlIds;
    }
}

module.exports = new EmployeeRepo();
