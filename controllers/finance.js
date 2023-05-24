const { validationResult } = require('express-validator');

const Finance = require('../models/finance');



exports.saveFinance = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const total_offering = req.body.total_offering;
    const total_tithes = req.body.total_tithes;
    const total_pledges = req.body.total_pledges;
    const total_expenses = req.body.total_expenses;
    const total_budget = req.body.total_budget;
    const cash_on_hand = req.body.cash_on_hand;
    const date = req.body.finance_date;

    try {

        const financeDetails = await Finance.getFinanceByDate(admin_id, date);

        if(financeDetails[0].length === 1){
            const finance_id = financeDetails[0][0].finance_id;

            const finance = {
                finance_id: finance_id,
                total_offering: total_offering,
                total_tithes: total_tithes,
                total_pledges: total_pledges,
                total_expenses: total_expenses,
                total_budget: total_budget,
                cash_on_hand: cash_on_hand
            };

            const result = await Finance.updateFinance(finance);
            res.status(201).json({ message: 'finance updated.'});
        }
        else{
            const finance = {
                admin_id: admin_id,
                total_offering: total_offering,
                total_tithes: total_tithes,
                total_pledges: total_pledges,
                total_expenses: total_expenses,
                total_budget: total_budget,
                cash_on_hand: cash_on_hand
            };
    
            const result = await Finance.save(finance);
    
            res.status(201).json({ message: 'finance saved.'});
        }
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFinanceByDate = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const church_id = parts[0];
    const date = parts[1] + "-%";

    try {
        const [finance] = await Finance.getFinanceByDate(church_id, date);

        res.json(finance);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}