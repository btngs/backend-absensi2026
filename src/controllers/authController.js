const userModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');
const cookie = require('cookie');
const { 
    generateAccessToken, 
    generateRefreshToken, 
    hashPassword: hashPW, 
    comparePassword: comparePW 
} = require('../utils/jwt');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return next(new AppError('Email and password are required', 400, {
            example: {
                email: 'email@example.com',
                password: 'password'
            }
        }));
        
        const user = await userModel.getByEmail(email);
        const payload ={id: user.id, role: user.role};

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        if (!user || !(await comparePW(password, user.password))) return next(new AppError('Invalid email or password', 401));

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        return res.json({
            message: "Successfully logged in",
            accessToken,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) return next(new AppError('Name, email and password are required', 400, {
            example: {
                name: 'John Doe',
                email: 'email@example.com',
                password: 'password'
            }
        }));

        const user = await userModel.getByEmail(email);
        if (user) return next(new AppError('user already exist', 409));

        const hashedPassword = await hashPW(password);
        const newUserId = await userModel.create({ name, email, password: hashedPassword, role: 'karyawan' });
        const newUser = await userModel.getById(newUserId);

        const payload = { id: newUser.id, role: newUser.role };
        const accessToken = generateAccessToken({ id: newUser.id, role: newUser.role });
        const refreshToken = generateRefreshToken({ id: newUser.id, role: newUser.role });

        return res.json({
            message: "User registered successfully",
            accessToken,
            data: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch(error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.json({
            message: "Successfully logged out"
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    login,
    register,
    logout
}