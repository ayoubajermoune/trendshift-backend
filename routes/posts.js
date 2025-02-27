const express = require('express');
const Post = require('../models/Post');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' },
      })
      .sort('-createdAt');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post (admin only)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update post (admin only)
router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post (admin only)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(204).json(null);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
