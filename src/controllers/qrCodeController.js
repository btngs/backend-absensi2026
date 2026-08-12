const qrCodeModel = require('../models/qrCodeModel');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

const qrCodeController = {
    getAllQR: async(req, res, next) => {
        try {
            const result = await qrCodeModel.getAll();
            return res.status(200).json({
                message: "success",
                data: result
            })
        } catch (error) {

        }
    },

    generateQR: async(req, res, next) => {
        try{
            const prefix = 'QR-ABSEN';
            const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();

            const code = `${prefix}-${randomString}`;
            const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

            const result = await qrCodeModel.create(code, expiredAt);
            return res.status(201).json({
                message: "success creating QR",
                data: result
            })
        } catch(error) {
            next(error);
        }
    },

    getActive: async(req, res, next) => {
        try{
            const result = await qrCodeModel.getActive();

            if(!result) {
                return res.status(404).json({
                    message: "QR Code expired"
                })
            }

            return res.status(200).json({
                message: "success",
                data: result
            })
        } catch(error) {
            next(error);
        }
    }
}

module.exports = qrCodeController;