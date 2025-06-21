const UserRepo = require('../Repository/UserRepo');
const jwt = require('jsonwebtoken');
const EmailRepo = require('../Repository/EmailRepo');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { Users, Employees } = require('../../models');

const emailRepo = new EmailRepo();

class loginController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    errors: ['Email and password are required.']
                });
            }

            const { user, error } = await UserRepo.validateUser(email, password);

            if (error) {
                return res.status(401).json({
                    status: false,
                    errors: [error]
                });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    user_type: user.user_type
                },
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );

            return res.status(200).json({
                status: true,
                token
            });
        } catch (err) {
            console.error('Error in login:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error']
            });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await Users.findOne({ where: { email, status: 1 } });

            if (!user) {
                return res.status(404).json({
                    status: false,
                    data: 'User not found'
                });
            }
            const password = await crypto.randomBytes(5).toString('hex');
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            user.reset_flag = true;
            await user.save();
            let userInfo;
            if (user.user_type == 'employee') {
                userInfo = await Employees.findOne({ where: { user_id: user.id } });
            } else {
                userInfo = 'Admin';
            }
            let salutation = userInfo == 'Admin' ? 'Hi Admin, ' : 'Dear ' + userInfo.name;

            const emailData = { salutation, password, email };
            let subject = 'Forgot Password Send Successfully';
            await emailRepo.sendEmail('forgot-email', subject, emailData);

            res.status(200).json({
                status: true,
                message: 'Email sent successfully'
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(200).json({
                status: false,
                data: 'Internal Server Error'
            });
        }
    }
    async resetPassword(req, res) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            const user = await Users.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    status: false,
                    data: 'User not found'
                });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    status: false,
                    data: 'Current password is incorrect'
                });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            user.reset_flag = false;
            await user.save();

            let userInfo;
            if (user.user_type == 'employee') {
                userInfo = await Employees.findOne({ where: { user_id: user.id } });
            } else {
                userInfo = 'Admin';
            }
            let salutation = userInfo == 'Admin' ? 'Hi Admin, ' : 'Dear ' + userInfo.name;

            let email = user.email;
            const emailData = { salutation, email };
            let subject = 'Password Reset Confirmation';
            emailRepo.sendEmail('reset-password-email', subject, emailData);

            res.status(200).json({
                status: true,
                data: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({
                status: false,
                data: 'Internal Server Error'
            });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
            res.status(200).json({
                status: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Error during logout:', error);
            res.status(500).json({
                status: false,
                data: 'Internal Server Error'
            });
        }
    }
}

module.exports = loginController;
