const conn = require('../config/connection');

const qrCodeModel = {
    create: async(code, expiredAt) => {
        const query = 'INSERT INTO qr_codes (code, expired_at, is_active, updated_at) VALUES (?, ?, 1, NOW(), NOW())';
        const [result] = await conn.execute(query, [code, expiredAt]);

        return result;
    },

    findValidCode: async(code) => {
        const query = 'SELECT * FROM qr_codes WHERE code = ? AND is_active = 1 AND expired_at > NOW()';
        const [rows] = await conn.execute(query, [code]);

        return rows[0];
    }
}

module.exports = qrCodeModel;