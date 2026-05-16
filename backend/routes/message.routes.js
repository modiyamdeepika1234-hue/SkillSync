const router = require('express').Router();
const c = require('../controllers/message.controller');
const protect = require('../middleware/auth');
router.get('/:userId', protect, c.history);
module.exports = router;
