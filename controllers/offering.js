const { validationResult } = require('express-validator');

const Offering = require('../models/offering');



exports.saveOffering = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const offering_amount = req.body.offering_amount;

    try {
        const offering = {
            admin_id: admin_id,
            offering_amount: offering_amount
        };

        const result = await Offering.save(offering);

        res.status(201).json({ message: 'offering saved.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.totalOfferings = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const offeringsTotal = await Offering.getTotalOfferings(admin_id, date);

        const total = offeringsTotal[0][0];

        res.json(total);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getOfferingsByDate = async (req, res, next) => {
    const idDate = req.params.id;
    const parts = idDate.split('@');

    const admin_id = parts[0];
    const date = parts[1];

    try {
        const [offeringsTotal] = await Offering.getAllOfferingsByDate(admin_id, date);

        res.json(offeringsTotal);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}