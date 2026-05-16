// Lightweight notification doc — pushed in-app and via socket.
const { Schema, model } = require('mongoose');
const notificationSchema = new Schema({
  user:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // recipient
  from:    { type: Schema.Types.ObjectId, ref: 'User' },
  type:    { type: String, enum: ['connection_request','connection_accepted','message','like'], required: true },
  message: { type: String, required: true },
  link:    { type: String, default: '' },
  read:    { type: Boolean, default: false },
}, { timestamps: true });
module.exports = model('Notification', notificationSchema);
