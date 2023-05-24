const nodemailer = require('nodemailer');

const Member = require('../models/member');
const Church = require('../models/church');
const Admin = require('../models/admin');


exports.sendOtp = async (req, res) => {

    const email = req.body.email;

    try {
        const user = await Member.findEmail(email);

        if(user[0].length !== 1){
            return res.json({ message: "email not found"});
        }

        const memberId = user[0][0].member_id;

        const otp = Math.floor(100000 + Math.random() * 900000);

        const line1 = "<p>Good day!</p>";
        const br = "<br>";
        const line2 = "<p>We are the CONsite team. We received your request to reset your password.</p>";
        const line3 = "<p><i>If it is not you, please disregard this email and do not share your OTP.</i></p>";
        const line4 = "<p>Thank you.</p>";
        const line5 = "<p>From CONsite Team.</p>";

        const text = line1 + br + line2 + "<b>" + otp + "</b>" + br + line3 + br + br + line4 + line5;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: 'consite.nazarene@gmail.com',
                pass: 'oluywhuqdzhzwmym',
            },
        });
    
        const options = {
            from: 'Church of the Nazarene <consite.nazarene@gmail.com>',
            to: email, // list of receivers
            subject: "OTP Verification Code", // Subject line
            text: text, // plain text body
            html: text, // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(options, (err, info) => {
            if(err){
                console.log("error: ", err);
            }
            else{
                console.log("email sent to: ", info);
            }
        });

        return res.json({
        message: "sent",
        otp: otp,
        member_id: memberId
        });

    } catch (error) {
       console.log(error); 
    }
    
}

exports.sendOtpForAdmin = async (req, res) => {

    const username = req.body.username;

    try {
        const admin = await Admin.findByUserame(username);

        if(admin[0].length !== 1){
            return res.json({ message: "username not found"});
        }

        const churchId = admin[0][0].church_id;
        const adminId = admin[0][0].admin_id;

        const church = await Church.getChurch(churchId);

        const email = church[0][0].church_email;

        const otp = Math.floor(100000 + Math.random() * 900000);

        const line1 = "<p>Good day!</p>";
        const br = "<br>";
        const line2 = "<p>We are the CONsite team. We received your request to reset your password.</p>";
        const line3 = "<p><i>If it is not you, please disregard this email and do not share your OTP.</i></p>";
        const line4 = "<p>Thank you.</p>";
        const line5 = "<p>From CONsite Team.</p>";

        const text = line1 + br + line2 + "<b>" + otp + "</b>" + br + line3 + br + br + line4 + line5;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: { 
                user: 'consite.nazarene@gmail.com',
                pass: 'oluywhuqdzhzwmym',
            },
        });
    
        const options = {
            from: 'CONSITE <consite.nazarene@gmail.com>',
            to: email, // list of receivers
            subject: "OTP Verification Code", // Subject line
            text: text, // plain text body
            html: text, // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(options, (err, info) => {
            if(err){
                console.log("error: ", err);
            }
            else{
                console.log("email sent to: ", info);
            }
        });

        return res.json({
        message: "sent",
        otp: otp,
        admin_id: adminId
        });

    } catch (error) {
       console.log(error); 
    }

    
}

