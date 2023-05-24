const express = require('express');
const { body } = require('express-validator');

const otpController = require('../controllers/otp');

const router = express.Router();

router.post('/send-otp', otpController.sendOtp);

router.post('/admin/send-otp', otpController.sendOtpForAdmin);

module.exports = router;