
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (using decorator pattern)
router.get('/profile', requireAuth(), getProfile);
router.put('/profile', requireAuth(), updateUserProfile);

module.exports = router;
