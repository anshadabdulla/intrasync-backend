const Departments = require('../../models/departments');
const Designation = require('../../models/designations');

class MasterDataRepo {
    async createDepartment(Data) {
        try {
            const department = await Departments.create({
                name: Data.name
            });

            return department;
        } catch (error) {
            throw error;
        }
    }
    async updateDepartment(data, id) {
        try {
            const department = await Departments.findOne({ where: { id } });

            if (!department) return null;

            await department.update({
                name: data.name
            });

            return department;
        } catch (error) {
            throw error;
        }
    }
    async createDesignation(Data) {
        try {
            const designation = await Designation.create({
                name: Data.name,
                type: Data.type,
                notice_period: Data.notice_period
            });

            return designation;
        } catch (error) {
            throw error;
        }
    }
    async updateDesignation(Data, id) {
        try {
            const designation = await Designation.findOne({ where: { id } });

            if (!designation) return null;

            await designation.update({
                name: Data.name,
                type: Data.type,
                notice_period: Data.notice_period
            });

            return designation;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MasterDataRepo();
