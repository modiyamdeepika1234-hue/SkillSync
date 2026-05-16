// REST endpoints for chat history. Live delivery happens in sockets/index.js.
const Message      = require('../models/Message');
const Connection   = require('../models/Connection');
const asyncHandler = require('../utils/asyncHandler');

async function ensureConnected(a, b) {
  const c = await Connection.findOne({
    status: 'accepted',
    $or: [{ requester: a, receiver: b }, { requester: b, receiver: a }],
  });
  return !!c;
}

exports.history = asyncHandler(async (req, res) => {
  const other = req.params.userId;
  if (!(await ensureConnected(req.user._id, other)))
    return res.status(403).json({ message: 'You are not connected with this user' });
  const msgs = await Message.find({
    $or: [
      { sender: req.user._id, receiver: other },
      { sender: other, receiver: req.user._id },
    ],
  }).sort('createdAt');
  res.json(msgs);
});
