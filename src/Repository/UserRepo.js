const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Users } = require('../../models');

class UserRepo {
    async getByEmail(email) {
        try {
            return await Users.findOne({
                where: {
                    [Op.or]: [{ username: { [Op.iLike]: email } }, { email: { [Op.iLike]: email } }]
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
            user.last_login = new Date();
            await user.save();
            return { user };
        } catch (error) {
            return { error: error.message || 'Internal Server Error' };
        }
    }
}

module.exports = new UserRepo();
