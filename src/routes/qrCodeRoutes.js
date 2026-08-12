const express = require('express');
const qrCodeController = require('../controllers/qrCodeController');
const { authToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', qrCodeController.generateQR);