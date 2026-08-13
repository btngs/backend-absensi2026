const conn = require('../config/connection.js');

const userModel = {

    getByEmail: async (email) => {
        const [rows] = await conn.execute('SELECT id, name, email, phone_number, password, role, created_at, updated_at FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    getAll: async () => {
        const [rows] = await conn.execute('SELECT id, name, email, phone_number, role, created_at, updated_at FROM users');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await conn.execute('SELECT id, name, email, phone_number, role, created_at, updated_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (userData) => {
        const { name, email, phone_number, password, role } = userData;
        const [result] = await conn.execute(
            'INSERT INTO users (name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone_number, password, role || 'karyawan']
        );
        return result.insertId;
    },

    update: async (id, userData) => {
        const dataToUpdate = {...userData, updated_at: new Date()};
        const [result] = await conn.query(
            'UPDATE users SET ? WHERE id = ?', [dataToUpdate, id]
        );
        return result.affectedRows;
    },

    remove: async (id) => {
        const [result] = await conn.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = userModel;
