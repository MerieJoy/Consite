const { validationResult } = require('express-validator');

const brcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const Church = require('../models/church');

exports.login = async (req, res, next) => {
    const admin_username = req.body.admin_username;
    const admin_password = req.body.admin_password;
    const admin_type = req.body.admin_type;

    try {
        const user = await Admin.findByUserame(admin_username);

        if(user[0].length !== 1){
            const message = "username not found.";

            const token = jwt.sign(
                {
                    admin_id: 0,
                    admin_username: admin_username,
                    admin_type: admin_type
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, admin_id: 0, admin_type: admin_type, church_id: 0, message: message });
        }

        const storedUser = user[0][0];

        if(admin_username !== storedUser.admin_username){
            const message = "Incorrect username.";

            const token = jwt.sign(
                {
                    admin_id: storedUser.admin_id,
                    admin_username: storedUser.admin_username,
                    admin_type: storedUser.admin_type
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, admin_id: storedUser.admin_id, admin_type: storedUser.admin_type, church_id: storedUser.church_id, message: message });
        }

        const isEqual = await brcypt.compare(admin_password, storedUser.admin_password);

        if(!isEqual){
            const message = "Incorrect password.";

            const token = jwt.sign(
                {
                    admin_id: storedUser.admin_id,
                    admin_username: storedUser.admin_username,
                    admin_type: storedUser.admin_type
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, admin_id: storedUser.admin_id, admin_type: storedUser.admin_type, church_id: storedUser.church_id, message: message });
        }

        if(admin_type !== storedUser.admin_type){
            const message = "Incorrect admin type.";

            const token = jwt.sign(
                {
                    admin_id: storedUser.admin_id,
                    admin_username: storedUser.admin_username,
                    admin_type: storedUser.admin_type
                },
                'secretfortoken',
                { expiresIn: '24h' }
            );
    
            return res.status(200).json({ token: token, admin_id: storedUser.admin_id, admin_type: storedUser.admin_type, church_id: storedUser.church_id, message: message });
        }

        const token = jwt.sign(
            {
                admin_id: storedUser.admin_id,
                admin_username: storedUser.admin_username,
                admin_type: storedUser.admin_type
            },
            'secretfortoken',
            { expiresIn: '24h' }
        );

        const message = "success";

        res.status(200).json({ token: token, admin_id: storedUser.admin_id, admin_type: storedUser.admin_type, church_id: storedUser.church_id, message: message });

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }  
}

exports.getAdmin = async (req, res, next) => {
    const admin_id = req.params.id;

    try {
        const getad = await Admin.getAdmin(admin_id);

        if(getad[0].length !== 1){
            const error = new Error("Username not found.");
            error.statusCode = 401;
            throw error;
        }

        const ad = getad[0][0];


        res.status(200).json(ad);

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.update = async (req, res, next) => {

    let file = "";
    if(req.file){
        file = req.file.path;
    }
    else{
        file = req.body.church_profile;
    }

    const path = file.replace('frontend\\', '');

    console.log("path: " + path);
    const church_name = req.body.church_name;
    const church_contact = req.body.church_contact;
    const church_email = req.body.church_email;
    const church_address = req.body.church_address;
    const church_profile = path.replaceAll('\\', '/');
    const admin_username = req.body.admin_username;
    const admin_type = req.body.admin_type;
    const admin_id = req.params.id;
    const church_id = req.body.church_id;

    try {
        console.log("church_id: " + church_id);
        console.log(church_email);
        const church = await Church.findChurchByEmail(church_email, church_id);
        if(church[0].length > 0){
            return res.json("Email already in use");
        }

        const admin = await Admin.findUserame(admin_username, admin_id);
        if(admin[0].length > 0){
            return res.json("Username already in use");
        }

        const churchDetails = {
            church_name: church_name,
            church_contact: church_contact,
            church_email: church_email,
            church_address: church_address,
            church_profile: church_profile
        };

        const churchResult = await Church.update(churchDetails, church_id);

        const adminDetails = {
            admin_username: admin_username,
            admin_type: admin_type
        }

        const adminResult = await Admin.update(adminDetails, admin_id);

        res.status(201).json({ message: 'successfully updated'});
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
        const getadmin = await Admin.getAdmin(id);

        if(getadmin[0].length !== 1){
            const error = new Error("Username not found.");
            error.statusCode = 401;
            throw error;
        }

        const user = getadmin[0][0];

        const isEqual = await brcypt.compare(old_password, user.admin_password);

        if(!isEqual){
            res.status.json({ message: "incorrect old password"});
            return;
        }

        const hashedPassword = await brcypt.hash(new_password, 12);

        const result = await Admin.changePassword(hashedPassword, id);
        res.status(201).json({ message: 'successfully changed password'});
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
        const hashedPassword = await brcypt.hash(new_password, 12);

        const result = await Admin.changePassword(hashedPassword, id);
        res.status(201).json({ message: 'password reset successful'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.addAdmin = async (req, res, next) => {
    const church_id = req.params.id;
    const church_name = req.body.church_name;
    const new_church_name = req.body.new_church_name;
    const church_contact = req.body.church_contact;
    const church_email = req.body.church_email;
    const church_address = req.body.church_address;
    const admin_username = req.body.admin_username;
    const admin_password = req.body.admin_password;
    const admin_type = req.body.admin_type;

    
    try {

        const hashedPassword = await brcypt.hash(admin_password, 12);

        if(church_name === 'other'){
            const church = {
                church_name: new_church_name,
                church_contact: church_contact,
                church_email: church_email,
                church_address: church_address
            };
    
            const saveChurch = await Church.save(church);
            const lastInsertedId = saveChurch;
    
            const admin = {
                church_id: lastInsertedId,
                admin_username: admin_username,
                admin_password: hashedPassword,
                admin_type: admin_type
            };
    
            const result = await Admin.save(admin);
            return res.json({ message: "Admin saved!"});
        }
    
        const uname = 'superadmin';
        const findAdmin = await Admin.getAdminByChurch(church_id, uname);
    
        if(findAdmin[0].length === 2){
            return res.json({ message: "two admins have already been registered for the selected church" });
            
        }
        else if(findAdmin[0].length === 1){
            const selected_admin_type = findAdmin[0][0].admin_type;
    
            if(admin_type === selected_admin_type){
                return res.json({ message: "selected church has already registered a " + admin_type });
                
            }
        }

        const findAdminByUsername = await Admin.findByUserame(admin_username);

        if(findAdminByUsername[0].length !== 0){
            return res.json({ message: "username already in use" });
        }
    
        const admin = {
            church_id: church_id,
            admin_username: admin_username,
            admin_password: hashedPassword,
            admin_type: admin_type
        };
    
        const result = await Admin.save(admin);
        res.json({ message: "Admin saved!"});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}