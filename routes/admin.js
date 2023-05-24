const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const DIR = 'frontend/assets/img/profile_images';

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("dir: " + DIR);
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log(Date.now() + '-' + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({storage: storage});

const authController = require('../controllers/admin');
const auth = require('../middleware/auth');


router.post(
    '/login', authController.login
);

router.post(
    '/:id',
    auth,
    upload.single('church_profile'),
    authController.update
);

router.get(
    '/:id', auth, authController.getAdmin
);

router.post(
    '/changePassword/:id',
    [
        auth,
        body('new_password').trim(),
        body('old_password').trim()
    ],
    authController.changePassword
);

router.post(
    '/password/forgot/:id',
    body('new_password').trim(),
    authController.forgotPassword
);

router.post(
    '/addAdmin/:id',
    [
        auth,
        body('church_name').trim(),
        body('new_church_name').trim(),
        body('church_contact').trim(),
        body('church_email').trim(),
        body('church_address').trim(),
        body('admin_username').trim(),
        body('admin_password').trim(),
        body('admin_type').trim()
    ],
    authController.addAdmin
)

module.exports = router;