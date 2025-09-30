const { Therapist, User } = require('../models/User');
const { validationResult, body } = require('express-validator');

/**
 * Search therapists by query
 */
const searchTherapists = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const searchFilter = {
            userType: 'therapist',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { specialties: { $regex: query, $options: 'i' } },
                { languages: { $regex: query, $options: 'i' } },
                { 'location.city': { $regex: query, $options: 'i' } },
                { 'location.state': { $regex: query, $options: 'i' } }
            ]
        };

        const therapists = await Therapist.find(searchFilter).select('-password');
        
        res.status(200).json({
            status: 'success',
            data: therapists.map(t => t.getProfileData())
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error searching therapists',
            error: error.message
        });
    }
};

/**
 * Validation rules for therapist profile updates
 */
const therapistValidation = [
    body('specialties').optional().isArray().withMessage('Specialties must be an array'),
    body('languages').optional().isArray().withMessage('Languages must be an array'),
    body('rate').optional().isNumeric().withMessage('Rate must be a number').isFloat({ min: 0 }).withMessage('Rate must be non-negative'),
    body('bio').optional().isLength({ max: 2000 }).withMessage('Bio must be less than 2000 characters'),
    body('experience').optional().isNumeric().withMessage('Experience must be a number').isInt({ min: 0 }).withMessage('Experience must be non-negative'),
    body('qualifications').optional().isArray().withMessage('Qualifications must be an array'),
    body('availability').optional().isObject().withMessage('Availability must be an object')
];

/**
 * Get all therapists with filtering and pagination
 */
const getAllTherapists = async (req, res) => {
    try {
        const { page = 1, limit = 10, specialty, minRate, maxRate, isVerified } = req.query;
        
        // Build filter object
        const filter = { userType: 'therapist' };
        if (specialty) filter.specialties = specialty;
        if (minRate) filter['rate.amount'] = { ...filter['rate.amount'], $gte: parseFloat(minRate) };
        if (maxRate) filter['rate.amount'] = { ...filter['rate.amount'], $lte: parseFloat(maxRate) };
        if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
        
        const therapists = await Therapist.find(filter)
            .select('-password')
            .sort({ isVerified: -1, createdAt: -1 });
            
        const total = await Therapist.countDocuments(filter);
        
        res.status(200).json({
            status: 'success',
            data: therapists.map(t => t.getProfileData()),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalTherapists: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching therapists',
            error: error.message
        });
    }
};

/**
 * Get therapist by ID
 */
const getTherapistById = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id).select('-password');
        if (!therapist || therapist.userType !== 'therapist') {
            return res.status(404).json({ 
                status: 'error',
                message: 'Therapist not found' 
            });
        }
        res.status(200).json({ 
            status: 'success',
            data: therapist.getProfileData() 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching therapist', error: error.message });
    }
};

/**
 * Get current therapist's profile (authenticated route)
 */
const getMyProfile = async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.user.id).select('-password');
        if (!therapist || therapist.userType !== 'therapist') {
            return res.status(404).json({ 
                status: 'error',
                message: 'Therapist profile not found' 
            });
        }
        res.status(200).json({ 
            status: 'success',
            data: therapist.getProfileData() 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

/**
 * Update therapist profile with validation
 */
const updateMyProfile = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const therapist = await Therapist.findById(req.user.id);
        if (!therapist || therapist.userType !== 'therapist') {
            return res.status(404).json({ 
                status: 'error',
                message: 'Therapist not found' 
            });
        }

        // Update allowed fields
        const allowedUpdates = ['name', 'specialties', 'languages', 'rate', 'bio', 'qualifications', 'experience', 'availability'];
        const updates = {};
        
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Apply updates
        Object.assign(therapist, updates);
        await therapist.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: therapist.getProfileData()
        });
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
};

/**
 * Update therapist availability
 */
const updateAvailability = async (req, res) => {
    try {
        const { availability } = req.body;
        
        // Validate availability object structure
        if (!availability || typeof availability !== 'object') {
            return res.status(400).json({ 
                status: 'error',
                message: 'Valid availability object is required' 
            });
        }

        // Validate availability days
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const hasValidDays = Object.keys(availability).every(day => validDays.includes(day));
        if (!hasValidDays) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Availability must include valid days of the week' 
            });
        }

        // Validate time slots format
        const isValidTimeFormat = (time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        const hasValidTimeSlots = Object.values(availability).every(slots =>
            Array.isArray(slots) && slots.every(slot =>
                slot && isValidTimeFormat(slot.start) && isValidTimeFormat(slot.end)
            )
        );
        if (!hasValidTimeSlots) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Time slots must be in valid HH:MM format' 
            });
        }

        const therapist = await Therapist.findById(req.user.id);
        if (!therapist || therapist.userType !== 'therapist') {
            return res.status(404).json({ 
                status: 'error',
                message: 'Therapist not found' 
            });
        }

        therapist.availability = availability;
        await therapist.save();

        res.status(200).json({
            status: 'success',
            data: {
                availability: therapist.availability
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Error updating availability',
            error: error.message 
        });
    }
};

/**
 * Search therapists by name or specialty
 */
const searchTherapists = async (req, res) => {
    try {
        const { query = '' } = req.query;
        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const searchRegex = new RegExp(query, 'i');
        const filter = {
            userType: 'therapist',
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { specialties: { $regex: query, $options: 'i' } },
                { languages: { $regex: query, $options: 'i' } },
                { 'location.city': { $regex: query, $options: 'i' } },
                { 'location.state': { $regex: query, $options: 'i' } }
            ]
        };

        const therapists = await Therapist.find(filter)
            .select('-password')
            .sort({ isVerified: -1, createdAt: -1 });

        const mappedData = therapists.map(t => ({
            _id: t._id,
            name: t.name,
            specialties: t.specialties || [],
            languages: t.languages || [],
            location: t.location || {},
            rate: t.rate || { amount: 0, currency: 'USD' },
            isVerified: t.isVerified || false
        }));

        res.status(200).json({
            status: 'success',
            data: mappedData
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Error searching therapists', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllTherapists,
    getTherapistById,
    getMyProfile,
    updateMyProfile,
    updateAvailability,
    searchTherapists,
    therapistValidation
};
