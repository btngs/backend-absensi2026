const express = require('express');
const app = express();
const cors = require('cors');
const usersRoutes = require('./src/routes/users');
const middlewareLog = require('./src/middleware/logs')
const userController = require('./src/controllers/userController')

app.use(cors());
app.use(middlewareLog);
app.use(express.json());

app.use('/users', usersRoutes);

app.listen(5000, () => {
    console.log('Server running in port 5000');
})