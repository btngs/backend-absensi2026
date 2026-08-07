const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { authToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/', authToken, authorizeRole('admin'), userController.getAllUsers);
router.get('/:id', authToken, userController.getUser);
router.post('/create', authToken, authorizeRole('admin'), userController.createNewUser);
router.put('/update/:id', authToken, authorizeRole('admin'), userController.updateUser);
router.delete('/delete/:id', authToken, authorizeRole('admin'), userController.deleteUser);

module.exports = router;