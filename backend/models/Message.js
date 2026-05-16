// One chat message between two connected users.
const { Schema, model } = require('mongoose');
const messageSchema = new Schema({
  sender:   { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  text:     { type: String, required: true, maxlength: 2000 },
  read:     { type: Boolean, default: false },
}, { timestamps: true });
module.exports = model('Message', messageSchema);
