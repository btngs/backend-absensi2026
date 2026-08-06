const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/create', userController.createNewUser);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;