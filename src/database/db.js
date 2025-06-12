const { Sequelize } = require('sequelize');
const config = require('../../config/config').development;

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host    : config.host,
        dialect : config.dialect,
        logging : console.log,
        define  : {
            timestamps : true,
            paranoid   : true,
        },
        pool: {
            max     : 5,
            min     : 0,
            acquire : 30000,
            idle    : 10000,
        },
    }
);

module.exports = sequelize;