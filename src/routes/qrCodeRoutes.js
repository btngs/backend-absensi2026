const express = require('express');
const qrCodeController = require('../controllers/qrCodeController');
const { authToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authToken, authorizeRole('admin'), qrCodeController.getAll);
router.get('/active', authToken, authorizeRole('admin'), qrCodeController.getActive);
router.post('/create', authToken, authorizeRole('admin'), qrCodeController.generateQR);

module.exports = router;
