const userModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');

const createNewUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body || {};
    
        if (!name || !email || !password || !role) {
            return next(new AppError('All fields are required', 400, {
                example: {
                    name: 'name',
                    email: 'name@example.com',
                    password: 'password',
                    role: 'karyawan'
                }
            }));
        }
    
        const id = await userModel.create({ name, email, password, role });
        return res.status(201).json({
            message: "User created successfully",
            data: { id, name, email, role }
        })
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
        const { name, email, password, role } = req.body || {};

        if (!name || !email || !password || !role) {
            return next(new AppError('All fields are required', 400, {
                example: {
                    name: 'name',
                    email: 'name@example.com',
                    password: 'password',
                    role: 'karyawan'
                }
            }));
        }

        const affectedRows = await userModel.update(id, { name, email, password, role });
        if (affectedRows === 0) {
            return next(new AppError('User not found', 404));
        }

        return res.json({
            message: "User updated successfully",
            data: { id, name, email, role }
        });

    

    } catch (error) {
        next(error);
    }

}

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
