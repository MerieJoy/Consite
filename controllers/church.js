const { validationResult } = require('express-validator');

const Church = require('../models/church');

const Admin = require('../models/admin');
const Member = require('../models/member');

const Tithes = require('../models/tithes');
const Offering = require('../models/offering');
const Pledge = require('../models/pledges');
const Expenses = require('../models/expenses');
const Finance = require('../models/finance');

const Baptismal = require('../models/baptismal');
const Attendance = require('../models/attendance');
const Event = require('../models/event');

exports.fetchAll = async (req, res, next) => {
    try {
        const [allChurch] = await Church.fetchAll();
        
        res.status(200).json(allChurch);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getChurch = async (req, res, next) => {
    const church_id = req.params.id;
    

    try {
        const getch = await Church.getChurch(church_id);

        if(getch[0].length !== 1){
            const error = new Error("Church not found.");
            error.statusCode = 404;
            throw error;
        }

        const church = getch[0][0];

        res.status(200).json(church);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteChurch = async (req, res, next) => {
    const church_id = req.params.id;

    try {
        
        const tithes_result = await Tithes.deleteTithes(church_id);
        const offering_result = await Offering.deleteOfferings(church_id);
        const pledges_result = await Pledge.deletePledges(church_id);
        const expenses_result = await Expenses.deleteExpenses(church_id);
        const finance_result = await Finance.deleteFinance(church_id);

        const event_result = await Event.deleteEvent(church_id);
        const baptismal_result = await Baptismal.deleteBaptismal(church_id);
        const attendance_result = await Attendance.deleteAtendance(church_id);

        const member_result = await Member.deleteMember(church_id);
        const admin_result = await Admin.deleteAdmin(church_id);

        const church_result = await Church.deleteChurch(church_id);

        console.log(church_id);

        return res.status(200).json({ message: "Church details have been successfully deleted!"});

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}