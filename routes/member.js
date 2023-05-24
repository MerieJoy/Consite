const express = require('express');
const { body } = require('express-validator');

const DIR = 'frontend/assets/img/profile_images';

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log("FIle: " + file);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({storage: storage});

const memberController = require('../controllers/member');
const auth = require('../middleware/auth');

router.post(
    '/:id',
    auth, 
    upload.single('mem_profile'),
     memberController.update
);

router.post(
    '/changePassword/:id',
    [
        auth,
        body('new_password').trim(),
        body('old_password').trim()
    ],
    memberController.changePassword
);

router.post(
    '/password/forgot/:id',
    [
        auth,
        body('new_password').trim()
    ],
    memberController.forgotPassword
);

router.get('/',auth, memberController.fetchAll);

router.get('/active/list/:id', auth, memberController.fetchAllActive);

router.get('/getMember/:id', auth, memberController.getMember);

router.get('/inactive/list/:id', auth, memberController.fetchAllInactive);

router.post(
    '/status/:id',
    auth,
    memberController.setStatus
);

module.exports = router;