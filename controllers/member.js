const { validationResult } = require('express-validator');

const brcypt = require('bcryptjs');

const Member = require('../models/member');

exports.getMember = async (req, res, next) => {
    const member_id = req.params.id;
    
    try {
        const getmem = await Member.getMember(member_id);

        if(getmem[0].length !== 1){
            const error = new Error("Username not found.");
            error.statusCode = 401;
            throw error;
        }

        const user = getmem[0][0];
        const formattedDate = new Date(user.mem_bday).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        user.mem_bday = formattedDate;

        res.status(200).json(user);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAll = async (req, res, next) => {
    try {
        const [allMembers] = await Member.fetchAll();
        res.status(200).json(allMembers);
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAllInactive = async (req, res, next) => {
    const idsearch = req.params.id;
    const parts = idsearch.split('-');
    const church_id = parts[0];
    const sexSearch = parts[1] + '%';
    const search = '%' + sexSearch;
    try {
        const mem_type = "inactive";
        const [inactiveMembers] = await Member.fetchInactive(mem_type, church_id, search, sexSearch);
        res.status(200).json(inactiveMembers);
    } catch (err) {
        res.status(200).json({ message: err });
    }
}

exports.fetchAllActive = async (req, res, next) => {
    const idsearch = req.params.id;
    const parts = idsearch.split('-');
    const church_id = parts[0];
    const sexSearch = parts[1] + '%';
    const search = '%' + sexSearch;

    try {
        const mem_type = "inactive";
        const [activeMembers] = await Member.fetchActive(mem_type, church_id, search, sexSearch);
        res.status(200).json(activeMembers);
    } catch (err) {
        res.status(200).json({ message: err });
    }
}

exports.update = async (req, res, next) => {

    let file = "";
    if(req.file){
        file = req.file.path;
    }
    else{
        file = req.body.mem_profile;
    }

    console.log("file path: " + file);

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push( err.msg ));
        
    }

    const path = file.replace('frontend\\', '');

    const church_id = req.body.church_id;
    const mem_profile = path.replaceAll('\\', '/');
    const mem_fname = req.body.mem_fname;
    const mem_mname = req.body.mem_mname;
    const mem_lname = req.body.mem_lname;
    const mem_suffix = req.body.mem_suffix;
    const mem_username = req.body.mem_username;
    const mem_bday = req.body.mem_bday;
    const mem_age = req.body.mem_age;
    const mem_sex = req.body.mem_sex;
    const mem_cluster = req.body.mem_cluster;
    const mem_address = req.body.mem_address;
    const mem_email = req.body.mem_email;
    const mem_type = req.body.mem_type;
    const member_id = req.params.id;



    try {
        const findUsername = await Member.findUserameExceptUser(mem_username, member_id);
        if(findUsername[0].length > 0){
            return res.json({ messages: 'Username already in use.' });
        }
    
        const findEmail = await Member.findEmailExceptUser(mem_email, member_id);
        if(findEmail[0].length > 0){
            return res.json({ messages: 'Email already in use.' });
        }

        const userDetails = {
            church_id: church_id,
            mem_profile: mem_profile,
            mem_fname: mem_fname,
            mem_mname: mem_mname,
            mem_lname: mem_lname,
            mem_suffix: mem_suffix,
            mem_username: mem_username,
            mem_bday: mem_bday,
            mem_age: mem_age,
            mem_sex: mem_sex,
            mem_cluster: mem_cluster,
            mem_address: mem_address,
            mem_email: mem_email,
            mem_type: mem_type
        };

        const result = await Member.update(userDetails, member_id);

        res.status(201).json({ message: 'successfully updated'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.forgotPassword = async (req, res, next) => {
    const new_password = req.body.new_password;
    const id = req.params.id;

    try {
        console.log(id);
        const hashedPassword = await brcypt.hash(new_password, 12);

        const result = await Member.changePassword(hashedPassword, id);
        res.status(201).json({ message: 'password has been successfully changed'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    const old_password = req.body.old_password;
    const new_password = req.body.new_password;
    const id = req.params.id;

    try {
        const getmem = await Member.getMember(id);

        if(getmem[0].length !== 1){
            const error = new Error("Username not found.");
            error.statusCode = 401;
            throw error;
        }

        const user = getmem[0][0];

        const isEqual = await brcypt.compare(old_password, user.mem_password);

        if(!isEqual){
            res.json({ message: "incorrect old password"});
            return;
        }

        const hashedPassword = await brcypt.hash(new_password, 12);

        const result = await Member.changePassword(hashedPassword, id);
        res.status(201).json({ message: 'successfully changed password'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.setStatus = async (req, res, next) => {
    const status = req.body.status;
    const id = req.params.id;

    try {
        const result = await Member.setStatus(status, id);
        const message = 'successfully changed';
        res.status(201).json({ message: message});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}