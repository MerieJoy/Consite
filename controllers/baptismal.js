const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const Baptismal = require('../models/baptismal');
const Member = require('../models/member');

exports.fetchAll = async (req, res, next) => {
    try {
        const [allBaptismal] = await Baptismal.fetchAll();

        const formattedBaptismalDate = allBaptismal.map(baptismal => {
            const formattedBaptismal = new Date(baptismal.baptismal_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const formattedBday = new Date(baptismal.candidate_bday).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return {
                ...baptismal,
                baptismal_date: formattedBaptismal,
                candidate_bday: formattedBday
            };
        });
        
        res.status(200).json(formattedBaptismalDate);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAllByMember = async (req, res, next) => {
    const member_id = req.params.id;

    try {
        const [allBaptismal] = await Baptismal.fetchAllByMemberId(member_id);
        const formattedBaptismalDate = allBaptismal.map(baptismal => {
            const formattedBaptismal = new Date(baptismal.baptismal_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            const formattedBday = new Date(baptismal.candidate_bday).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            return {
                ...baptismal,
                baptismal_date: formattedBaptismal,
                candidate_bday: formattedBday
            };
        });
        
        res.status(200).json(formattedBaptismalDate);
        
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchById = async (req, res, next) => {
    const baptismal_id = req.params.id;
    

    try {
        const getbaptism = await Baptismal.fetchById(baptismal_id);

        if(getbaptism[0].length !== 1){
            const error = new Error("request not found.");
            error.statusCode = 404;
            throw error;
        }

        const baptism = getbaptism[0][0];

        const formatBaptismalDate = new Date(baptism.baptismal_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const formatBirthDate = new Date(baptism.candidate_bday).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        baptism.baptismal_date = formatBaptismalDate;
        baptism.candidate_bday = formatBirthDate;

        res.status(200).json(baptism);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.approveRequest = async (req, res, next) => {
    const ids = req.params.id;
    const idparts = ids.split('@');

    const baptismal_id = idparts[0];
    const member_id = idparts[1];

    try {

        const member = await Member.getMember(member_id);

        const member_email = member[0][0].mem_email;
        const church_email = member[0][0].church_email;
        const baptismal = await Baptismal.fetchById(baptismal_id);

        const baptismal_date = baptismal[0][0].baptismal_date;

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
          const formattedDate = `${months[baptismal_date.getMonth()]} ${baptismal_date.getDate().toString().padStart(2, '0')}, ${baptismal_date.getFullYear()}`;

        const approved = await Baptismal.approveRequest(baptismal_id);

        const line1 = "<p>Good day!</p>";
        const br = "<br>";
        const line2 = "<p>We are the CONsite Team. We are sending you this email to inform you that your request for baptismal has been approved for this specific date: <b>" + formattedDate + "</b></p>";
        const line3 = "<p>Please be reminded. Thank you.</p>";
        const line4 = "<p>From CONsite Team.</p>";

        const text = line1 + br + line2 + line3 + line4;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: 'consite.nazarene@gmail.com',
                pass: 'oluywhuqdzhzwmym',
            },
        });
    
        const options = {
            from: 'Church of the Nazarene <' + church_email + '>',
            to: member_email, // list of receivers
            subject: "OTP Verification Code", // Subject line
            text: text, // plain text body
            html: text, // html body
        };

        transporter.sendMail(options, (err, info) => {
            if(err){
                console.log("error: ", err);
            }
            else{
                console.log("email sent to: ", info);
            }
        });

        res.status(201).json({ message: 'Baptismal Approved.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
    
}

exports.reschedRequest = async (req, res, next) => {
    const id = req.params.id;
    const reschedForMail = req.body.reschedDaetForMail;
    const reschedDate = req.body.reschedDate;
    const member_id = req.body.member_id

    try {
        const member = await Member.getMember(member_id);

        const member_email = member[0][0].mem_email;
        const church_email = member[0][0].church_email;


        const resched = await Baptismal.reschedBaptismal(reschedDate, id);

        const line1 = "<p>Good day!</p>";
        const br = "<br>";
        const line2 = "<p>We are the CONsite Team. We are sending you this email to inform you that your request for baptismal has been rescheduled to this specific date: <b>" + reschedForMail + "</b> due to the church's availability as well as its facilitators.</p>";
        const line3 = "<p>Please be reminded. Thank you.</p>";
        const line4 = "<p>From CONsite Team.</p>";

        const text = line1 + br + line2 + line3 + line4;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: 'consite.nazarene@gmail.com',
                pass: 'oluywhuqdzhzwmym',
            },
        });
    
        const options = {
            from: 'Church of the Nazarene <' + church_email + '>',
            to: member_email, // list of receivers
            subject: "OTP Verification Code", // Subject line
            text: text, // plain text body
            html: text, // html body
        };

        transporter.sendMail(options, (err, info) => {
            if(err){
                console.log("error: ", err);
            }
            else{
                console.log("email sent to: ", info);
            }
        });

        res.status(201).json({ message: 'Baptismal Rescheduled.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.saveBaptismal = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const member_id = req.body.member_id;
    const baptismal_date = req.body.baptismal_date;
    const candidate_name = req.body.candidate_name;
    const candidate_bday = req.body.candidate_bday;
    const candidate_age = req.body.candidate_age;
    const candidate_bplace = req.body.candidate_bplace;
    const candidate_sex = req.body.candidate_sex;
    const candidate_mother = req.body.candidate_mother;
    const candidate_father = req.body.candidate_father;
    const candidate_status = req.body.candidate_status;

    try {

        const baptismal = {
            member_id: member_id,
            baptismal_date: baptismal_date,
            candidate_name: candidate_name,
            candidate_bday: candidate_bday,
            candidate_age: candidate_age,
            candidate_bplace: candidate_bplace,
            candidate_sex: candidate_sex,
            candidate_mother: candidate_mother,
            candidate_father: candidate_father,
            candidate_status: candidate_status
        };

        const result = await Baptismal.save(baptismal);

        res.status(201).json({ message: 'Baptismal Requested.'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}