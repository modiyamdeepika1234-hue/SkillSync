const router = require('express').Router();
const c = require('../controllers/connection.controller');
const protect = require('../middleware/auth');
router.get('/',          protect, c.mine);
router.get('/pending',   protect, c.pending);
router.post('/:userId',  protect, c.send);          // send request to userId
router.put('/:id/respond', protect, c.respond);     // body: { action:'accept'|'reject' }
module.exports = router;
