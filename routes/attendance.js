const express = require('express');
const { body } = require('express-validator');

const attendanceController = require('../controllers/attendance');

const auth = require('../middleware/auth');

const router = express.Router();

router.get(
    '/:id',
    auth,
    attendanceController.fetchAllForByDate
);

router.get(
    '/count/:id',
    auth,
    attendanceController.countCluster
);

router.get(
    '/barcode/:id',
    auth,
    attendanceController.getMemberByBarcode
);

router.get(
    '/demographics/:id',
    auth,
    attendanceController.getDemographics
);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('member_id').trim().not().isEmpty().withMessage('Please scan a valid barcode'),
        body('attendance_date').trim().not().isEmpty(),
        body('attendance_time').trim().not().isEmpty()
    ], attendanceController.saveAttendance
);

module.exports = router;