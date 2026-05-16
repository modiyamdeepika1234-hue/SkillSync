const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (_req, res) => {
  const posts = await Post.find().populate('author', 'name avatar').sort('-createdAt').limit(50);
  res.json(posts);
});

exports.create = asyncHandler(async (req, res) => {
  const post = await Post.create({ author: req.user._id, content: req.body.content, tags: req.body.tags || [] });
  await post.populate('author', 'name avatar');
  res.status(201).json(post);
});

exports.like = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const idx = post.likes.findIndex((u) => u.equals(req.user._id));
  if (idx === -1) post.likes.push(req.user._id); else post.likes.splice(idx, 1);
  await post.save();
  res.json({ likes: post.likes.length, liked: idx === -1 });
});
