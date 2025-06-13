const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Middleware pour vérifier l'admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit' });
  }
  next();
};

// Statistiques du dashboard
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const postCount = await Post.countDocuments();
    const userCount = await User.countDocuments();
    const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      postCount,
      userCount,
      latestPosts,
      latestUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gestion des utilisateurs
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;