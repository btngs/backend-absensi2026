const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
}

const generateAccessToken = (payLoad) => {
    return jwt.sign(payLoad, ACCESS_SECRET, { expiresIn: '30m' });
}

const generateRefreshToken = (payLoad) => {
    return jwt.sign(payLoad, REFRESH_SECRET, { expiresIn: '7d' });
}

module.exports = {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken
};