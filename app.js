require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require('./src/database/db');
const loginRouter = require('./src/router/loginRouter');
const employeeRouter = require('./src/router/employeeRouter');
require('./models');

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/api', loginRouter);
app.use('/api', employeeRouter);

sequelize
    .sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
