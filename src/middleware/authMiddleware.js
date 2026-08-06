const { verifyAccessToken } = require('../utils/jwt');
const { AppError } = require('./errorHandler');

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new AppError('Access token is missing', 401));
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;

        console.log("isi req user:", req.user);

        next();
    } catch (error) {
        return next(new AppError('Invalid or expired access token', 403));
    }
}

const authorizeRole = (req, res, next) => {
    console.log("current role:", req.user?.role);
    if(req.user && req.user.role === 'admin') {
        next();
    }
    return next(new AppError('Unauthorized Access', 403));
}

module.exports = {
    authToken,
    authorizeRole
}