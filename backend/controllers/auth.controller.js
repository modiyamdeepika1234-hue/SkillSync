// Register, login (password) and Google OAuth login.
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sanitize = (u) => ({
  _id: u._id, name: u.name, email: u.email, avatar: u.avatar, bio: u.bio,
  skillsOffered: u.skillsOffered, skillsWanted: u.skillsWanted, connections: u.connections,
});

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user._id), user: sanitize(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: signToken(user._id), user: sanitize(user) });
});

// Receives the Google ID token from the frontend (@react-oauth/google),
// verifies it with Google, then creates or fetches the matching user.
exports.googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Missing Google credential' });
  const ticket = await googleClient.verifyIdToken({
    idToken: credential, audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();        // { sub, email, name, picture, ... }
  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      name: payload.name, email: payload.email,
      googleId: payload.sub, avatar: payload.picture,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (!user.avatar) user.avatar = payload.picture;
    await user.save();
  }
  res.json({ token: signToken(user._id), user: sanitize(user) });
});

exports.me = asyncHandler(async (req, res) => res.json(sanitize(req.user)));
