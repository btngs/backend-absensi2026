const userModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');
const jwt = require('jsonwebtoken'); // Pastikan library jsonwebtoken / jwt helper di-import
const { 
    generateAccessToken, 
    generateRefreshToken, 
    hashPassword: hashPW, 
    comparePassword: comparePW 
} = require('../utils/jwt');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return next(new AppError('Email and password are required', 400, {
                example: { email: 'email@example.com', password: 'password' }
            }));
        }
        
        const user = await userModel.getByEmail(email);
        if (!user) {
            return next(new AppError('Email not found', 404));
        }

        const passwordMatch = await comparePW(password, user.password);
        if (!passwordMatch) {
            return next(new AppError('Invalid password', 401));
        }

        const payload = { id: user.id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Hari
        });

        return res.json({
            message: "Successfully logged in",
            accessToken,
            user: { 
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

const register = async (req, res, next) => {
    try {
        const { name, email, phone_number, password } = req.body || {};
        if (!name || !email || !phone_number || !password) {
            return next(new AppError('Name, email, phone number and password are required', 400));
        }

        const user = await userModel.getByEmail(email);
        if (user) return next(new AppError('User already exists', 409));

        const hashedPassword = await hashPW(password);
        const newUserId = await userModel.create({ name, email, phone_number, password: hashedPassword, role: 'karyawan' });
        const newUser = await userModel.getById(newUserId);

        const payload = { id: newUser.id, role: newUser.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            message: "User registered successfully",
            accessToken,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone_number: newUser.phone_number,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at,
                role: newUser.role
            }
        });

    } catch(error) {
        next(error);
    }
}

// FUNGSI BARU: Dipanggil oleh Axios Interceptor Frontend saat Access Token expired
const refreshToken = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies?.refreshToken;
        if (!tokenFromCookie) {
            return next(new AppError('Refresh token not found', 401));
        }

        // Verifikasi refresh token menggunakan Secret Key Refresh Token Anda
        const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
        
        // Buat Access Token baru
        const newAccessToken = generateAccessToken({ id: decoded.id, role: decoded.role });

        return res.json({
            status: "success",
            accessToken: newAccessToken
        });
    } catch (error) {
        return next(new AppError('Invalid or expired refresh token', 403));
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
    refreshToken,
    logout
}
