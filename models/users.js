const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../src/database/db');

const Users = sequelize.define(
    'Users',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        reset_flag: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        paranoid: true,
        timestamps: true
    }
);

module.exports = Users;
