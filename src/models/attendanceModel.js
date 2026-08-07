const conn = require('../config/connection.js');

const attendanceModel = {
  createCheckIn: async (data) => {
    const { userId, tanggal, jamMasuk, status, keterangan } = data;
    const query = `
      INSERT INTO attendances (user_id, tanggal, jam_masuk, status, keterangan)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await conn.execute(query, [
      userId ?? null,
      tanggal ?? null,
      jamMasuk ?? null,
      status ?? 'Hadir',
      keterangan ?? null
    ]);
    return result;
  },

  updateCheckOut: async (id, jamKeluar) => {
    const query = `
      UPDATE attendances SET jam_keluar = ?
      WHERE id = ?
    `;

    const [result] = await conn.execute(query, [jamKeluar ?? null, id]);
    return result;
  },

  findByUserAndDate: async (userId, tanggal) => {
    const query = `
      SELECT * FROM attendances
      WHERE user_id = ? AND tanggal = ?
    `;
    const [rows] = await conn.execute(query, [userId, tanggal]);
    return rows[0];
  },

  findByUserId: async (userId) => {
    const query = `
      SELECT 
        a.id,
        a.user_id,
        a.tanggal,
        a.jam_masuk,
        a.jam_keluar,
        a.status,
        a.keterangan,
        a.created_at
      FROM attendances a
      WHERE a.user_id = ?
      ORDER BY a.tanggal DESC, a.jam_masuk DESC
    `;

    const [result] = await conn.execute(query, [userId]);
    return result;
  },

  findAllWithUser: async () => {
    const query = `
      SELECT 
        a.id,
        a.tanggal,
        a.jam_masuk,
        a.jam_keluar,
        a.status,
        a.keterangan,
        a.created_at,
        u.id AS user_id,
        u.name,
        u.email
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.tanggal DESC, a.jam_masuk DESC
    `;

    const [result] = await conn.execute(query);
    return result;
  },

  findById: async (id) => {
    const query = `
      SELECT
        a.*,
        u.name,
        u.email
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await conn.execute(query, [id]);
    return rows[0];
  },

  deleteById: async (id) => {
    const query = `DELETE FROM attendances WHERE id = ?`;
    const [result] = await conn.execute(query, [id]);
    return result;
  }
};

module.exports = attendanceModel;