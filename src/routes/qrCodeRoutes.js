const express = require('express');
const qrCodeController = require('../controllers/qrCodeController');
const { authToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authorizeRole('admin'), qrCodeController.get)
router.post('/create', authorizeRole('admin'), qrCodeController.generateQR);