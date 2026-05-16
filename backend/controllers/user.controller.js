const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select('name email avatar bio skillsOffered skillsWanted connections')
    .limit(50);
  res.json(users);
});

exports.getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('name email avatar bio skillsOffered skillsWanted connections');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

exports.update = asyncHandler(async (req, res) => {
  const allowed = ['name','bio','avatar','skillsOffered','skillsWanted'];
  allowed.forEach((k) => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  await req.user.save();
  res.json(req.user);
});
