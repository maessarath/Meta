const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

// Recherche avancée
router.get('/search', async (req, res) => {
  try {
    const { query, category, author, dateFrom, dateTo } = req.query;
    
    const searchQuery = {};
    
    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) searchQuery.category = category;
    if (author) searchQuery.author = author;
    
    if (dateFrom || dateTo) {
      searchQuery.createdAt = {};
      if (dateFrom) searchQuery.createdAt.$gte = new Date(dateFrom);
      if (dateTo) searchQuery.createdAt.$lte = new Date(dateTo);
    }
    
    const posts = await Post.find(searchQuery)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;