class LoginController {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username: { [Op.iLike]: username } } });
      
            if (!user) {
                res.status(200).json({
                    status: false,
                    data: "Invalid username or password"
                });
                return;
            }
            if(user.status == 1){
                const isPasswordValid = await bcrypt.compare(password.trim(), user.password.trim());
                if (isPasswordValid) {
                    const roles = await RoleUser.findAll({ where: { "user_id": user.id } });
                    
                    const empRoles = await Promise.all(roles.map(async (role) => {
                        const roleData = await Roles.findByPk(role.role_id);
                        return roleData;
                    }));
                    
                    let permissions = [];
                    
                    if (roles.length > 0) {
                        permissions = await Promise.all(roles.map(async (role) => {
                            const rolePermissions = await Permissions.findAll({
                                attributes: ['name'],
                                include: [{
                                    model: PermissionRole,
                                    as: "Permission_role",
                                    required: false,
                                }],
                                where: {
                                    "$Permission_role.role_id$": role.role_id
                                }
                            });
    
                            return rolePermissions.map(permission => permission.name);
                        }));
                    }
                    
                    const token = jwt.sign({
                        id: user.id,
                        user_type: user.user_type,
                        username: user.username,
                        roles: empRoles,
                    }, process.env.JWT_SECRET, { expiresIn: '12h' });
                    
                    const refreshToken = jwt.sign({
                        id: user.id,
                        roles: roles.map(role => role.role_id),
                        username: user.username
                    }, process.env.JWT_REFRESH_TOKEN_SECRET);

                    const currentDate = new Date();             
                    const date = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate(),
                        currentDate.getHours(),
                        currentDate.getMinutes(),
                        currentDate.getSeconds()
                    ).toISOString();

                    user.last_login = date;
                    user.save();
                    
                    res.status(200).json({
                        status: true,
                        token: token,
                        refreshToken: refreshToken,
                        userInfo: await this.userInfoNew(user),
                        permissions: permissions.flat(),
                        reset_flag: user.reset_flag,
                    });
                } else {
                    res.status(200).json({
                        status: false,
                        data: "Invalid username or password"
                    });
                }
            } else {
                res.status(200).json({
                    status: false,
                    data: "Inactive User"
                });
            }

        } catch (error) {
            console.error('Error during login:', error);
            res.status(200).json({
                status: false,
                data: "Internal Server Error"
            });
        }
    } 
    
}
module.exports = LoginController;