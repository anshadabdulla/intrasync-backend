const UserRepo = require('../Repository/UserRepo');
const jwt = require('jsonwebtoken');

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
                { expiresIn: '24h' }
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

            const user = await User.findOne({ where: { email, status: 1 } });

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
            if (user.user_type == 'candidate') {
                userInfo = await Candidates.findOne({ where: { user_id: user.id } });
            } else if (user.user_type == 'employee') {
                userInfo = await Employees.findOne({ where: { user_id: user.id } });
            } else {
                userInfo = 'Admin';
            }
            let salutation = userInfo == 'Admin' ? 'Hi Admin, ' : 'Dear ' + userInfo.name;

            const emailData = { salutation, password, email };
            let subject = 'Account Created Successfully';
            EmailRepo.sendEmail('forgot-email', subject, emailData);

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
}

module.exports = loginController;
