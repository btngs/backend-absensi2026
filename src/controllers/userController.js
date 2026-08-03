const userModel = require('../models/userModel');

const createNewUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};
    
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
    
        const id = await userModel.create({ name, email, password, role });
        return res.status(201).json({
            message: "User created successfully",
            data: { id, name, email, role }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await userModel.getAll();
        return res.json({
            message: "success",
            data: result
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error retrieving users",
            error: error.message
        })
    }
};

const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await userModel.getById(id);

        if (!result) return res.status(404).json({
            message: "User not found"
        });

        return res.json({
            message: "success",
            data: result
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error retrieving user",
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body || {};

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const affectedRows = await userModel.update(id, { name, email, password, role });
        if (affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User updated successfully",
            data: { id, name, email, role }
        });

    

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }

}

const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await userModel.remove(id);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User deleted successfully",
            data: { id }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};


module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
};
