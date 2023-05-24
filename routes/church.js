const express = require('express');
const { body } = require('express-validator');

const churchController = require('../controllers/church');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', churchController.fetchAll);

router.get('/:id', auth, churchController.getChurch);

router.post('/:id', auth, churchController.deleteChurch);

module.exports = router;