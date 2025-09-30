const express = require('express');
const { requireTherapist, requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { 
    getAllTherapists,
    getTherapistById,
    getMyProfile,
    updateMyProfile,
    updateAvailability,
    searchTherapists,
    therapistValidation
} = require('../controllers/therapistController');

const router = express.Router();

// Public routes
router.get('/', optionalAuth(), getAllTherapists);                    // Get all therapists with optional auth for enhanced data
router.get('/search', optionalAuth(), searchTherapists);             // Search therapists
router.get('/:id', optionalAuth(), getTherapistById);                // Get specific therapist profile

// Therapist-only routes (using decorator pattern)
router.get('/me/profile', requireTherapist(), getMyProfile);          // Get own profile
router.put('/me/profile', requireTherapist(), therapistValidation, updateMyProfile);  // Update own profile
router.put('/me/availability', requireTherapist(), updateAvailability);  // Update availability

module.exports = router;
