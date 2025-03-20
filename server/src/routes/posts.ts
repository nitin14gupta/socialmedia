import express from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { auth } from '../middleware/auth';
import { Post } from '../models/Post';
import { User } from '../models/User';

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
    }
  }
});

// Validation schemas
const createPostSchema = z.object({
  caption: z.string().min(1).max(2200),
});

const commentSchema = z.object({
  text: z.string().min(1).max(500)
});

// Create a post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { caption } = createPostSchema.parse(req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const post = new Post({
      user: req.user._id,
      caption,
      image: imageUrl
    });
    
    await post.save();

    // Update user's post count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });
    
    // Populate user details
    await post.populate('user', 'username avatar');
    
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')
      .populate('likes', 'username')
      .populate('comments.user', 'username avatar');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get feed posts (posts from user and followed users)
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const following = user.following || [];
    
    const posts = await Post.find({
      $or: [
        { user: req.user._id },
        { user: { $in: following } }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('user', 'username avatar')
    .populate('likes', 'username')
    .populate('comments.user', 'username avatar');
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike a post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a comment
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { text } = commentSchema.parse(req.body);
    
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });
    
    await post.save();
    await post.populate('comments.user', 'username avatar');
    
    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      user: req.user._id
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 