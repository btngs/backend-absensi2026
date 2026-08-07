const AttendanceModel = require('../models/attendanceModel');
const { AppError } = require('../middleware/errorHandler');

const attendanceController = {
  checkIn: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { status = 'Hadir', keterangan = '' } = req.body;

      const now = new Date();
      const tanggal = now.toISOString().split('T')[0];
      const jamMasuk = now.toTimeString().split(' ')[0];

      const existingAttendance = await AttendanceModel.findByUserAndDate(userId, tanggal);
      if (existingAttendance) {
        return next(new AppError('Anda sudah melakukan absensi masuk hari ini', 400));
      }

      const result = await AttendanceModel.createCheckIn({
        userId,
        tanggal,
        jamMasuk,
        status,
        keterangan
      });

      return res.status(201).json({
        success: true,
        message: 'Absen masuk berhasil dicatat',
        data: {
          id: result.insertId,
          user_id: userId,
          tanggal,
          jam_masuk: jamMasuk,
          status,
          keterangan
        }
      });
    } catch (error) {
      next(error);
    }
  },

  checkOut: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const now = new Date();
      const tanggal = now.toISOString().split('T')[0];
      const jamKeluar = now.toTimeString().split(' ')[0];

      const attendance = await AttendanceModel.findByUserAndDate(userId, tanggal);
      if (!attendance) {
        return next(new AppError('Anda belum melakukan absen masuk hari ini', 404));
      }

      if (attendance.jam_keluar) {
        return next(new AppError('Anda sudah melakukan absen keluar hari ini', 400));
      }

      await AttendanceModel.updateCheckOut(attendance.id, jamKeluar);

      return res.status(200).json({
        success: true,
        message: 'Absen keluar berhasil dicatat',
        data: {
          id: attendance.id,
          tanggal,
          jam_masuk: attendance.jam_masuk,
          jam_keluar: jamKeluar
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getMyHistory: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const history = await AttendanceModel.findByUserId(userId);

      return res.status(200).json({
        success: true,
        message: 'Riwayat absensi berhasil diambil',
        data: history
      });
    } catch (error) {
      next(error);
    }
  },

  getAllAttendances: async (req, res, next) => {
    try {
      const attendances = await AttendanceModel.findAllWithUser();

      return res.status(200).json({
        success: true,
        message: 'Seluruh data absensi berhasil diambil',
        data: attendances
      });
    } catch (error) {
      next(error);
    }
  },

  getAttendanceById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const attendance = await AttendanceModel.findById(id);

      if (!attendance) {
        return next(new AppError('Data absensi tidak ditemukan', 404));
      }

      return res.status(200).json({
        success: true,
        message: 'Detail absensi ditemukan',
        data: attendance
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = attendanceController;