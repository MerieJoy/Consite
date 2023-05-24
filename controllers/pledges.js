const { validationResult } = require('express-validator');

const Pledge = require('../models/pledges');
const Member = require('../models/member');



exports.savePledge = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const member_id = req.body.member_name;
    const pledge_purpose = req.body.pledge_purpose;
    const pledge_amount = req.body.pledge_amount;

    try {
        const pledge = {
            admin_id: admin_id,
            member_id: member_id,
            pledge_purpose: pledge_purpose,
            pledge_amount: pledge_amount
        };

        const result = await Pledge.save(pledge);

        res.status(201).json({ message: 'pledge saved.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.totalPledges = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const PledgeTotal = await Pledge.getTotalPledges(admin_id, date);

        const total = PledgeTotal[0][0];

        res.json(total);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getPledgesByDate = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const [pledgesTotal] = await Pledge.getAllPledgesByDate(admin_id, date);

        res.json(pledgesTotal);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}