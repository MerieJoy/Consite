const express = require('express');
const { body } = require('express-validator');

const baptismalController = require('../controllers/baptismal');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, baptismalController.fetchAll);

router.get('/member/:id', auth, baptismalController.fetchAllByMember);

router.get('/:id', auth, baptismalController.fetchById);

router.post(
    '/',
    [
        auth,
        body('member_id').trim(),
        body('baptismal_date').trim().not().isEmpty().withMessage('Please add a baptismal date'),
        body('candidate_name').trim().not().isEmpty().withMessage('Please add a candidate name'),
        body('candidate_bday').trim().not().isEmpty().withMessage('Please add candidate birthday.'),
        body('candidate_age').trim().not().isEmpty().withMessage('Please add candidate age'),
        body('candidate_bplace').trim().not().isEmpty().withMessage('Please add candidate birth place'),
        body('candidate_sex').trim().not().isEmpty().withMessage('Please select candidate sex'),
        body('candidate_mother').trim().not().isEmpty().withMessage('Please add candidate mother.'),
        body('candidate_father').trim().not().isEmpty().withMessage('Please add candidate mother.'),
        body('candidate_status').trim().not().isEmpty()
    ], baptismalController.saveBaptismal
);

router.post('/approve/:id', auth, baptismalController.approveRequest);

router.post('/reschedule/:id', auth, baptismalController.reschedRequest);

module.exports = router;