const { validationResult } = require('express-validator');

const Tithes = require('../models/tithes');
const Member = require('../models/member');



exports.saveTithes = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const member_id = req.body.member_name;
    const tithes_amount = req.body.tithes_amount;

    const date = new Date();

    try {
        const tithes = {
            admin_id: admin_id,
            member_id: member_id,
            tithes_amount: tithes_amount,
            tithes_date: date
        };

        const result = await Tithes.save(tithes);

        res.status(201).json({ message: 'tithes saved.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.totalTithes = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const tithesTotal = await Tithes.getTotalTithes(admin_id, date);

        const total = tithesTotal[0][0];

        res.json(total);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getTithesByDate = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const [tithesTotal] = await Tithes.getAllTithesByDate(admin_id, date);

        res.json(tithesTotal);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}