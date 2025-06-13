const express = require('express');
const { register, login, protect } = require('../controllers/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Exemple de route protégée
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

module.exports = router;