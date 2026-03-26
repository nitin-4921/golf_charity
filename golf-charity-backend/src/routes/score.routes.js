const router = require('express').Router();
const { addScore, getScores, editScore, deleteScore } = require('../controllers/score.controller');
const { protect, requireActiveSubscription } = require('../middleware/auth');
const { validate, scoreSchema } = require('../utils/validators');

router.use(protect, requireActiveSubscription);

router.get('/', getScores);
router.post('/', validate(scoreSchema), addScore);
router.put('/:scoreId', editScore);
router.delete('/:scoreId', deleteScore);

module.exports = router;
