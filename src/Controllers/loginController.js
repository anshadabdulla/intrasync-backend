const UserRepo = require('../Repository/UserRepo');
const jwt = require('jsonwebtoken');

class loginController {

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    errors: ['Email and password are required.'],
                });
            }

            const { user, error } = await UserRepo.validateUser(email, password);

            if (error) {
                return res.status(401).json({
                    status: false,
                    errors: [error],
                });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, user_type: user.user_type },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                status: true,
                token,
            });

        } catch (err) {
            console.error('Error in login:', err);
            return res.status(500).json({
                status: false,
                errors: [err.message || 'Internal Server Error'],
            });
        }
    }
}

module.exports = loginController;