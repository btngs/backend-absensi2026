const userModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');
const { 
    hashPassword: hashPW, 
    comparePassword: comparePW
    } = require('../utils/jwt')

const createNewUser = async (req, res, next) => {
    try {
        const { name, email, phone_number, password, role } = req.body || {};
    
        if (!name || !email || !phone_number || !password || !role) {
            return next(new AppError('All fields are required', 400, {
                example: {
                    name: 'name',
                    email: 'name@example.com',
                    phone_number: '081234567890',
                    password: 'password',
                    role: 'karyawan'
                }
            }));
        }

        const hashedPassword = await hashPW(password);
    
        const id = await userModel.create({ name, email, phone_number, password: hashedPassword, role });
        const createdUser = await userModel.getById(id);
        return res.status(201).json({
            message: "User created successfully",
            data: createdUser
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const result = await userModel.getAll();
        return res.json({
            message: "success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await userModel.getById(id);

        if (!result) return next(new AppError('User not found', 404));

        return res.json({
            message: "success",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone_number, password, role } = req.body || {};

        if (!name || !email || !phone_number) {
            return next(new AppError('Name, email, and phone number are required', 400, {
                example: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone_number: '081234567890',
                    role: 'karyawan',
                    password: 'password'
                }
            }));
        }

        const existingUser = await userModel.getById(id);
        if (!existingUser) {
            return next(new AppError('User not found', 404));
        }

        const updateData = { name, email, phone_number };

        if (role) {
            updateData.role = role;
        }

        if (password && password.trim() !== '') {
            updateData.password = await hashPW(password);
        }

        await userModel.update(id, updateData);

        const updatedUser = await userModel.getById(id);

        return res.json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        next(error);
    }
};

const deleteUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const affectedRows = await userModel.remove(id);

        if (affectedRows === 0) {
            return next(new AppError('User not found', 404));
        }

        return res.json({
            message: "User deleted successfully",
            data: { id }
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};
