const { validationResult } = require('express-validator');

const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Member = require('../models/member');

exports.register = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        return res.json({ messages: extractedErrors});
    }

    const church_id = req.body.church_id;
    const mem_fname = req.body.mem_fname;
    const mem_mname = req.body.mem_mname;
    const mem_lname = req.body.mem_lname;
    const mem_suffix = req.body.mem_suffix;
    const mem_username = req.body.mem_username;
    const mem_password = req.body.mem_password;
    const mem_bday = req.body.mem_bday;
    const mem_age = req.body.mem_age;
    const mem_sex = req.body.mem_sex;
    const mem_cluster = req.body.mem_cluster;
    const mem_address = req.body.mem_address;
    const mem_email = req.body.mem_email;
    const mem_type = req.body.mem_type;

    try {
        const hashedPassword = await brcypt.hash(mem_password, 12);

        const userDetails = {
            church_id: church_id,
            mem_fname: mem_fname,
            mem_mname: mem_mname,
            mem_lname: mem_lname,
            mem_username: mem_username,
            mem_password: hashedPassword,
            mem_bday: mem_bday,
            mem_age: mem_age,
            mem_sex: mem_sex,
            mem_cluster: mem_cluster,
            mem_address: mem_address,
            mem_email: mem_email,
            mem_type: mem_type
        };

        const result = await Member.save(userDetails);
        const lastInsertedId = result;
        const updateId = lastInsertedId.toString().padStart(3, '0');
        const barcodechurchid = church_id.toString().padStart(3, '0');

        if(mem_suffix.length !== 0){
            const suffixResult = await Member.updateSuffix(mem_suffix, lastInsertedId);
        }
        
        const currentyear = new Date().getFullYear().toString();
        const barcode = currentyear + barcodechurchid + updateId;

        const updateResult = await Member.updateRegistration(barcode, lastInsertedId);

        res.status(201).json({ message: 'registration successful'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.login = async (req, res, next) => {
    const mem_username = req.body.mem_username;
    const mem_password = req.body.mem_password;

    try {
        const user = await Member.findUserame(mem_username);

        if(user[0].length !== 1){
            const message = "username not found.";

            const token = jwt.sign(
                {
                    member_id: 0,
                    mem_username: mem_username,
                    message: message
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, member_id: 0, church_id: 0, message: message });
        }

        const storedUser = user[0][0];

        if(mem_username !== storedUser.mem_username){
            const message = "Incorrect username.";

            const token = jwt.sign(
                {
                    member_id: storedUser.member_id,
                    mem_username: storedUser.mem_username,
                    message: message
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, member_id: storedUser.member_id, church_id: storedUser.church_id, message: message });
        }

        const isEqual = await brcypt.compare(mem_password, storedUser.mem_password);

        if(!isEqual){
            const message = "Incorrect password.";

            const token = jwt.sign(
                {
                    member_id: storedUser.member_id,
                    mem_username: storedUser.mem_username
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, member_id: storedUser.member_id, church_id: storedUser.church_id, message: message });
        }

        const token = jwt.sign(
            {
                member_id: storedUser.member_id,
                mem_username: storedUser.mem_username,
            },
            'secretfortoken',
            { expiresIn: '24h' }
        );

        const message = 'success';

        res.status(200).json({ token: token, member_id: storedUser.member_id, church_id: storedUser.church_id, message: message });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
}