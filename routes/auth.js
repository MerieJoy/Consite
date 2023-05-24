const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const Member = require('../models/member');

const authController = require('../controllers/auth');

router.post(
    '/register',
    [
        body('mem_fname').trim().not().isEmpty(),
        body('mem_lname').trim().not().isEmpty(),
        body('mem_username').trim().not().isEmpty()
        .custom(async (mem_username) =>{
            const member = await Member.findUserame(mem_username);
            if(member[0].length > 0){
                return Promise.reject('Username already in use.')
            }
        }),
        body('mem_password').trim(),
        body('mem_address').trim().not().isEmpty(),
        body('mem_email').isEmail()
        .custom(async (mem_email) =>{
            const member = await Member.findEmail(mem_email);
            if(member[0].length > 0){
                return Promise.reject('email already in use.')
            }
        })
    ], authController.register
);

router.post(
    '/login', authController.login
);

module.exports = router;