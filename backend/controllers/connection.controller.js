// Instagram-style connection requests.
const Connection   = require('../models/Connection');
const Notification = require('../models/Notification');
const User         = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { emitToUser } = require('../sockets');

exports.send = asyncHandler(async (req, res) => {
  const receiverId = req.params.userId;
  if (receiverId === String(req.user._id))
    return res.status(400).json({ message: "You can't connect with yourself" });

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, receiver: receiverId },
      { requester: receiverId,   receiver: req.user._id },
    ],
  });
  if (existing) return res.status(409).json({ message: 'Request already exists', connection: existing });

  const conn = await Connection.create({ requester: req.user._id, receiver: receiverId });

  const notif = await Notification.create({
    user: receiverId, from: req.user._id, type: 'connection_request',
    message: `${req.user.name} sent you a connection request`,
    link: '/notifications',
  });
  emitToUser(receiverId, 'notification:new', notif);
  emitToUser(receiverId, 'connection:request', conn);

  res.status(201).json(conn);
});

exports.respond = asyncHandler(async (req, res) => {
  const { action } = req.body;             // 'accept' | 'reject'
  const conn = await Connection.findById(req.params.id);
  if (!conn) return res.status(404).json({ message: 'Request not found' });
  if (!conn.receiver.equals(req.user._id))
    return res.status(403).json({ message: 'Not your request to handle' });

  conn.status = action === 'accept' ? 'accepted' : 'rejected';
  await conn.save();

  if (action === 'accept') {
    await User.findByIdAndUpdate(conn.requester, { $addToSet: { connections: conn.receiver } });
    await User.findByIdAndUpdate(conn.receiver,  { $addToSet: { connections: conn.requester } });

    const notif = await Notification.create({
      user: conn.requester, from: req.user._id, type: 'connection_accepted',
      message: `${req.user.name} accepted your connection request`,
      link: '/skill-exchange',
    });
    emitToUser(conn.requester, 'notification:new', notif);
    emitToUser(conn.requester, 'connection:accepted', conn);
  }
  res.json(conn);
});

exports.pending = asyncHandler(async (req, res) => {
  const list = await Connection.find({ receiver: req.user._id, status: 'pending' })
    .populate('requester', 'name avatar bio skillsOffered');
  res.json(list);
});

exports.mine = asyncHandler(async (req, res) => {
  const list = await Connection.find({
    status: 'accepted',
    $or: [{ requester: req.user._id }, { receiver: req.user._id }],
  })
    .populate('requester', 'name avatar')
    .populate('receiver',  'name avatar');
  res.json(list);
});
