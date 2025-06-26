const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/db');

const Employees = sequelize.define(
    'Employees',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blood_group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        doj: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        residential_address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        permenent_address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        department: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        designation: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        teamlead: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        prefix: {
            type: DataTypes.STRING,
            allowNull: true
        },
        father_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true
        },
        probation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emergency_phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        relation: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ctc_salary: {
            type: DataTypes.STRING,
            allowNull: true
        },
        distance_from_office: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stay_in: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    },
    {
        paranoid: true,
        timestamps: true
    }
);

module.exports = Employees;
