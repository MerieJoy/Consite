const express = require('express');
const { body } = require('express-validator');

const financeController = require('../controllers/finance');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, financeController.getFinanceByDate);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('total_offering').trim(),
        body('total_tithes').trim(),
        body('total_pledges').trim(),
        body('total_expenses').trim(),
        body('total_budget').trim(),
        body('cash_on_hand').trim()
    ], financeController.saveFinance
);

module.exports = router;