const { validationResult } = require('express-validator');

const Expenses = require('../models/expenses');



exports.saveExpenses = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const expenses_purpose = req.body.expenses_purpose;
    const expenses_amount = req.body.expenses_amount;

    try {
        const expenses = {
            admin_id: admin_id,
            expenses_purpose: expenses_purpose,
            expenses_amount: expenses_amount
        };

        const result = await Expenses.save(expenses);

        res.status(201).json({ message: 'expenses saved.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.totalExpenses = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const expensesTotal = await Expenses.getTotalExpenses(admin_id, date);

        const total = expensesTotal[0][0];

        res.json(total);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getExpensesByDate = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const [expensesTotal] = await Expenses.getAllExpensesByDate(admin_id, date);

        res.json(expensesTotal);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}