require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require('./src/database/db');
const loginRouter = require('./src/router/loginRouter');

app.use(express.json());

app.use('/login', loginRouter);;

sequelize.sync()
	.then(() => {
		console.log('Database synced');
	})
	.catch(err => {
		console.error('Error syncing database:', err);
	});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});