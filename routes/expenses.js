const express = require('express');
const { body } = require('express-validator');

const expensesController = require('../controllers/expenses');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, expensesController.totalExpenses);

router.get('/getAll/:id', auth, expensesController.getExpensesByDate);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('expenses_purpose').trim(),
        body('expenses_amount').trim()
    ], expensesController.saveExpenses
);

module.exports = router;