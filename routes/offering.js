const express = require('express');
const { body } = require('express-validator');

const offeringController = require('../controllers/offering');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, offeringController.totalOfferings);

router.get('/getAll/:id', auth, offeringController.getOfferingsByDate);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('offering_amount').trim()
    ], offeringController.saveOffering
);

module.exports = router;