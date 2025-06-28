const sequelize = require('../database/db');
const { Employees, DailyUpdates } = require('../../models');
const { calculateTotalTime } = require('../helper/commonHelper');

class dailyUpdateRepo {
    async checkDuplication({ title }) {
        try {
            return await DailyUpdates.findOne({ where: { title: title } });
        } catch (error) {
            throw error;
        }
    }

    async create(Data, userId) {
        try {
            const totalTime = calculateTotalTime(Data.start_time, Data.end_time);

            const employee = await Employees.findOne({ where: { user_id: userId } });

            const dailyUpdate = await DailyUpdates.create({
                title: Data.title,
                date: Data.date,
                start_time: Data.start_time,
                end_time: Data.end_time,
                total_time: totalTime,
                description: Data.description,
                teamlead: employee ? employee.teamlead : null,
                created_by: employee ? employee.id : null
            });

            return dailyUpdate;
        } catch (error) {
            throw error;
        }
    }

    async update(id, updateData) {
        try {
            const totalTime = calculateTotalTime(updateData.start_time, updateData.end_time);

            const employee = await Employees.findOne({ where: { id: updateData.created_by } });
            const dailyUpdate = await DailyUpdates.findOne({ where: { id } });

            await dailyUpdate.update({
                title: updateData.title,
                date: updateData.date,
                start_time: updateData.start_time,
                end_time: updateData.end_time,
                total_time: totalTime,
                description: updateData.description,
                teamlead: employee ? employee.teamlead : null,
                created_by: employee ? employee.id : null
            });

            return dailyUpdate;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new dailyUpdateRepo();
