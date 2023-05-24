const express = require('express');
const { body } = require('express-validator');

const pledgeController = require('../controllers/pledges');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, pledgeController.totalPledges);

router.get('/getAll/:id', auth, pledgeController.getPledgesByDate);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('member_name').trim(),
        body('pledge_purpose').trim(),
        body('pledge_amount').trim(),
        body('church_id').trim()
    ], pledgeController.savePledge
);

module.exports = router;