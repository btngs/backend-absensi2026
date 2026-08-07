const express = require('express');
const app = express();

//routes
const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/authroutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes')

//middleware
const middlewareLog = require('./src/middleware/logs');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');

//essentials
const cors = require('cors');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(middlewareLog.logRequest);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if(process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`app listening from port ${PORT}`);
    });
};

module.exports = app;
module.exports.handler = serverless(app);