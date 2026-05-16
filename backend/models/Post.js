// Community post — used by Community page.
const { Schema, model } = require('mongoose');
const postSchema = new Schema({
  author:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  tags:    [{ type: String }],
  likes:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
module.exports = model('Post', postSchema);
