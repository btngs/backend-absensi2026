const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { authToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authToken);

router.post('/check-in', attendanceController.checkIn);
router.patch('/check-out', attendanceController.checkOut);
router.get('/history', attendanceController.getMyHistory);

router.get('/', authorizeRole('admin'), attendanceController.getAllAttendances);
router.get('/:id', authorizeRole('admin'), attendanceController.getAttendanceById);

module.exports = router;