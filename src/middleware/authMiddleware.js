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
        console.log('Decoded token:', decoded);
        req.user = decoded;

        next();
    } catch (error) {
        return next(new AppError('Invalid or expired access token', 403));
    }
}

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("req.user:", req.user);
        console.log("req.user.role:", req.user?.role);
        console.log("allowedRoles:", allowedRoles);
        console.log(
            "role match:",
            allowedRoles.includes(req.user?.role)
        );
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError('Unauthorized Access', 403));
        }

        return next();
    };
};

module.exports = {
    authToken,
    authorizeRole
}