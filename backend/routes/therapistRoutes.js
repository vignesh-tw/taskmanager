const express = require('express');
const { AuthenticationDecorator, RoleAuthorizationDecorator, ResourceOwnerDecorator } = require('../patterns/AuthDecorator');
const repositoryFactory = require('../repositories/RepositoryFactory');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Initialize repositories
const therapistRepository = repositoryFactory.getRepository('therapist');
const slotRepository = repositoryFactory.getRepository('slot');

// Base controller for fetching therapist profile
class TherapistProfileController {
    async execute(req, res) {
        try {
            const userId = req.user.id;
            console.log('Fetching therapist profile for user ID:', userId);

            // Get therapist data from user repository (since therapists are stored as users)
            const userRepository = repositoryFactory.getRepository('user');
            const therapist = await userRepository.findById(userId);
            
            if (!therapist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Therapist profile not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: therapist.getProfileData()
            });
        } catch (error) {
            console.error('[Get Therapist Profile Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching therapist profile',
                error: error.message
            });
        }
    }
}

// Base controller for listing therapists
class ListTherapistsController {
    async execute(req, res) {
        try {
            const { specialization, location, language } = req.query;
            let therapists;

            if (specialization) {
                therapists = await therapistRepository.findBySpecialization(specialization);
            } else if (location) {
                const [city, state] = location.split(',').map(s => s.trim());
                therapists = await therapistRepository.findByLocation(city, state);
            } else if (language) {
                therapists = await therapistRepository.findByLanguage(language);
            } else {
                therapists = await therapistRepository.findAvailable();
            }

            return res.status(200).json({
                status: 'success',
                data: therapists
            });
        } catch (error) {
            console.error('[List Therapists Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching therapists'
            });
        }
    }
}

// Base controller for searching therapists
class SearchTherapistsController {
    async execute(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Search query is required'
                });
            }

            const therapists = await therapistRepository.search(query);

            return res.status(200).json({
                status: 'success',
                data: therapists
            });
        } catch (error) {
            console.error('[Search Therapists Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error searching therapists'
            });
        }
    }
}

// Base controller for getting therapist profile
class GetTherapistProfileController {
    async execute(req, res) {
        try {
            const therapist = await therapistRepository.findById(req.params.id);
            if (!therapist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Therapist not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: therapist.getProfileData()
            });
        } catch (error) {
            console.error('[Therapist Profile Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching therapist profile'
            });
        }
    }
}

// Base controller for updating therapist profile
class UpdateTherapistProfileController {
    async execute(req, res) {
        try {
            const updatedTherapist = await therapistRepository.updateProfile(
                req.user.id,
                req.body
            );

            return res.status(200).json({
                status: 'success',
                data: updatedTherapist.getProfileData()
            });
        } catch (error) {
            console.error('[Update Therapist Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating therapist profile'
            });
        }
    }
}

// Base controller for updating availability
class UpdateAvailabilityController {
    async execute(req, res) {
        try {
            const { availability } = req.body;
            const therapist = await therapistRepository.findById(req.user.id);
            
            if (!therapist) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Therapist not found'
                });
            }

            // Update availability
            therapist.availability = availability;
            await therapist.save();

            return res.status(200).json({
                status: 'success',
                message: 'Availability updated successfully',
                data: {
                    availability: therapist.availability
                }
            });
        } catch (error) {
            console.error('[Update Availability Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating availability'
            });
        }
    }
}

// Import auth middleware
const { requireAuth } = require('../middleware/authMiddleware');

// Create decorated controllers
const listTherapists = new ListTherapistsController();
const searchTherapists = new SearchTherapistsController();
const getTherapistProfile = new GetTherapistProfileController();
const therapistProfile = new TherapistProfileController();
const updateTherapistProfile = new AuthenticationDecorator(
    new RoleAuthorizationDecorator(
        new UpdateTherapistProfileController(),
        ['therapist']
    )
);
const updateAvailability = new AuthenticationDecorator(
    new RoleAuthorizationDecorator(
        new UpdateAvailabilityController(),
        ['therapist']
    )
);

// Routes
router.get('/', (req, res) => listTherapists.execute(req, res));
router.get('/search', (req, res) => searchTherapists.execute(req, res));
router.get('/me/profile', requireAuth(), (req, res) => {
    console.log('Hit /me/profile route, user:', req.user);
    therapistProfile.execute(req, res);
});
router.get('/:id', (req, res) => getTherapistProfile.execute(req, res));
router.put('/me/profile', (req, res, next) => updateTherapistProfile.execute(req, res, next));
router.put('/me/availability', (req, res, next) => updateAvailability.execute(req, res, next));

// File upload route
router.post('/me/upload-photo', 
    (req, res, next) => new AuthenticationDecorator(
        new RoleAuthorizationDecorator(
            { execute: uploadProfilePicture },
            ['therapist']
        )
    ).execute(req, res, next),
    upload.single('profilePicture')
);

module.exports = router;
