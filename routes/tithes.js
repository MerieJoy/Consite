const express = require('express');
const { body } = require('express-validator');

const tithesController = require('../controllers/tithes');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:id', auth, tithesController.totalTithes);

router.get('/getAll/:id', auth, tithesController.getTithesByDate);

router.post(
    '/',
    [
        auth,
        body('admin_id').trim(),
        body('member_name').trim(),
        body('tithes_amount').trim(),
        body('church_id').trim()
    ], tithesController.saveTithes
);

module.exports = router;