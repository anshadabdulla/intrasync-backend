const { Op } = require("sequelize");
const User = require("../../models/user");
const bcrypt = require('bcryptjs');

class UserRepo {

    async getByEmail(email) {
        try {
            return await User.findOne({
                where: {
                    [Op.or]: [
                        { username: email },
                        { email: email }
                    ]
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async validateUser(email, password) {
        try {
            const user = await this.getByEmail(email);
            if (!user) {
                return { error: 'Invalid credentials.' };
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return { error: 'Invalid credentials.' };
            }
            return { user };
        } catch (error) {
            return { error: error.message || 'Internal Server Error' };
        }
    }

    async createUserAndEmployee(employeeData) {
        try {
            const user = await User.create({
                username: employeeData.employee_no,
                password: 'login@123',
                user_type: 'employee',
                email: employeeData.email,
                status: 1,
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepo();