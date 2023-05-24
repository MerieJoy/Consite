const express = require('express');
const { body } = require('express-validator');

const eventController = require('../controllers/event');

const auth = require('../middleware/auth');
const DIR = 'frontend/assets/img/event_images';

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

router.get('/', auth, eventController.fetchAll);

router.post(
    '/',
        auth,
        upload.single('event_image'),
        eventController.postEvent
);

router.delete(
    '/:id', auth, eventController.deleteEvent
);

module.exports = router;