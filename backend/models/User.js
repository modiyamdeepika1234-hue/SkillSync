// User schema. Supports both password and Google OAuth users.
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, select: false },        // hidden by default
  googleId:    { type: String, index: true },           // set when user signs in with Google
  avatar:      { type: String, default: '' },
  bio:         { type: String, default: '' },
  skillsOffered:  [{ type: String }],
  skillsWanted:   [{ type: String }],
  connections: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  if (!this.password) return false;
  return bcrypt.compare(plain, this.password);
};

module.exports = model('User', userSchema);
