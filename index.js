const express = require('express');
const app = express();
const cors = require('cors');
const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/authroutes');
const middlewareLog = require('./src/middleware/logs');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(middlewareLog);
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(5000, () => {
    console.log('Server running in port 5000');
})
