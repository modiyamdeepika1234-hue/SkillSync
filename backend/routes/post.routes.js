const router = require('express').Router();
const c = require('../controllers/post.controller');
const protect = require('../middleware/auth');
router.get('/', protect, c.list);
router.post('/', protect, c.create);
router.post('/:id/like', protect, c.like);
module.exports = router;
