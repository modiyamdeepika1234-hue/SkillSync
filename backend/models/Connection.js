// Connection request between two users (Instagram-style follow request).
// status: 'pending' until receiver accepts, then 'accepted'.
const { Schema, model } = require('mongoose');
const connectionSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  receiver:  { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status:    { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });
connectionSchema.index({ requester: 1, receiver: 1 }, { unique: true });
module.exports = model('Connection', connectionSchema);
