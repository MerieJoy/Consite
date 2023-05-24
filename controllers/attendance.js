const { validationResult } = require('express-validator');

const Attendance = require('../models/attendance');
const Member = require('../models/member');

exports.fetchAllForByDate = async (req, res, next) => {
    try {
        const dateId = req.params.id;
        const parts = dateId.split('@');
        const attendance_date = parts[0];
        const church_id = parts[1];

        const [allAttendance] = await Attendance.fetchAllForByDate(attendance_date, church_id);
        
        const formattedAttendance = allAttendance.map(attendance => {
            const attendanceDate = new Date(attendance.attendance_date);
            const formattedDate = attendanceDate.toISOString().slice(0, 10);

            const timeString = attendance.attendance_time;
            
            const timeParts = timeString.split(':');
            let hour =  parseInt(timeParts[0]);
            const min =  parseInt(timeParts[1]);
            let amPm = "am";

            let hours12 = 0;

            if(hour > 12){
                hours12 = hour % 12;
                amPm = "pm";
            }
            else if(hour < 12 && hour !== 0) {
                hours12 = hour;
            }
            else if(hour === 12){
                hours12 = hour;
                amPm = "pm";
            }
            else if(hour === 0){
                hours12 = 12;
            }

            const formattedTime = hours12.toString().padStart(2, "0") + ":" + min.toString().padStart(2, "0") + " " + amPm;

            return {
                ...attendance,
                attendance_time: formattedTime,
                attendance_date: formattedDate
            };
        });
        
        res.status(200).json(formattedAttendance);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getMemberByBarcode = async (req, res, next) => {
    const barcode = req.params.id;

   try {
        if(barcode.length === 0){
            return res.status(200).json({ message: "invalid barcode"});
        }
        const member = await Member.getMemberByBarcode(barcode);

        if(member[0] < 1){
            return res.status(200).json({ message: "barcode not found"});
        }

        const attendee = member[0][0];
        res.status(200).json(attendee);
   } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
   }
}

exports.saveAttendance = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const admin_id = req.body.admin_id;
    const member_id = req.body.member_id;
    const attendance_date = req.body.attendance_date;
    const attendance_time = req.body.attendance_time;
    const date = new Date(Date.parse(attendance_date)).toISOString().slice(0, 10);

    const timeParts = attendance_time.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const isPM = attendance_time.toLowerCase().includes('pm');

    let hours24 = hours;
    if (isPM && hours < 12) {
    hours24 += 12;
    } else if (!isPM && hours === 12) {
    hours24 = 0;
    }

    const time = new Date();
    time.setHours(hours24, minutes, 0);

    try {

        const attended = await Attendance.alreadyAttended(member_id, date);

        if(attended[0].length > 0){
            res.json({ message: "already scanned" });
            return;
        }
            

        const attendance = {
            admin_id: admin_id,
            member_id: member_id,
            attendance_date: date,
            attendance_time: time
        };

        const result = await Attendance.save(attendance);

        res.status(201).json({ message: 'attended.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.countCluster = async (req, res, next) => {
    const dateChurch = req.params.id;
    const parts = dateChurch.split('@');
    const date = parts[0];
    const church_id = parts[1];

    try {

        const [allAttendance] = await Attendance.countByDate(date, church_id);
    
        res.status(200).json(allAttendance);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getDemographics = async (req, res, next) => {
    const dateId = req.params.id;
    const parts = dateId.split('@');
    const date = parts[0] + "-%";
    const church_id = parts[1];

    try {

        const [demographics] = await Attendance.getDemographics(date, church_id);
    
        res.status(200).json(demographics);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }    

    
}