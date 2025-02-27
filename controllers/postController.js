import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    // Ensure only admin can create posts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can create posts' 
      });
    }

    const { title, content, image, category } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      image: image || null,
      category: category || 'general',
      status: 'published'
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating post', 
      error: error.message 
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching posts', 
      error: error.message 
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching post', 
      error: error.message 
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    // Ensure only admin can update posts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can update posts' 
      });
    }

    const { title, content, image, category, status } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      { 
        title, 
        content, 
        image, 
        category, 
        status 
      }, 
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating post', 
      error: error.message 
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    // Ensure only admin can delete posts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can delete posts' 
      });
    }

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post deleted successfully',
      post: deletedPost
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting post', 
      error: error.message 
    });
  }
};
