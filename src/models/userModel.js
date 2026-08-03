const conn = require('../config/connection.js');

const userModel = {
    getAll: async () => {
        const [rows] = await conn.execute('SELECT id, name, email, role, created_at FROM users');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await conn.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (userData) => {
        const { name, email, password, role } = userData;
        const [result] = await conn.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, password, role || 'karyawan']
        );
        return result.insertId;
    },

    update: async (id, userData) => {
        const { name, email, password, role } = userData;
        const [result] = await conn.execute(
            'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
            [name, email, password, role, id]
        );
        return result.affectedRows;
    },

    remove: async (id) => {
        const [result] = await conn.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = userModel;
