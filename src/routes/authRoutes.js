const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); 
const authController = require('../controllers/userController');

router.post('/signup', upload.single('profileImage'), authController.signup);

router.post('/login', authController.login);

router.get('/dashboard', authController.dashboard);

module.exports = router;
