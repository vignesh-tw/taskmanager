const express = require('express');
const { AuthenticationDecorator, RoleAuthorizationDecorator } = require('../patterns/AuthDecorator');
const repositoryFactory = require('../repositories/RepositoryFactory');
const router = express.Router();

// Initialize repositories
const slotRepository = repositoryFactory.getRepository('slot');

// Base controller for listing slots
class ListSlotsController {
    async execute(req, res) {
        try {
            const { therapistId, startDate, endDate } = req.query;
            
            // Default to showing slots from now until next 30 days
            const defaultStartDate = new Date();
            const defaultEndDate = new Date();
            defaultEndDate.setDate(defaultEndDate.getDate() + 30);

            const slots = await slotRepository.findAvailableSlots(
                therapistId || undefined,
                startDate ? new Date(startDate) : defaultStartDate,
                endDate ? new Date(endDate) : defaultEndDate
            );

            return res.status(200).json({
                status: 'success',
                data: slots
            });
        } catch (error) {
            console.error('[List Slots Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching slots'
            });
        }
    }
}

// Base controller for creating slots
class CreateSlotController {
    async execute(req, res) {
        try {
            const { start, end } = req.body;
            
            // Check for overlapping slots
            const overlapping = await slotRepository.findOverlapping(
                req.user.id,
                new Date(start),
                new Date(end)
            );

            if (overlapping.length > 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Slot overlaps with existing slots'
                });
            }

            const slot = await slotRepository.create({
                therapist: req.user.id,
                start: new Date(start),
                end: new Date(end),
                status: 'available'
            });

            return res.status(201).json({
                status: 'success',
                data: slot
            });
        } catch (error) {
            console.error('[Create Slot Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error creating slot'
            });
        }
    }
}

// Base controller for getting slot details
class GetSlotController {
    async execute(req, res) {
        try {
            const slot = await slotRepository.findById(req.params.id);
            if (!slot) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Slot not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: slot
            });
        } catch (error) {
            console.error('[Get Slot Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error fetching slot'
            });
        }
    }
}

// Base controller for updating slot
class UpdateSlotController {
    async execute(req, res) {
        try {
            const { status } = req.body;
            const slot = await slotRepository.findById(req.params.id);
            
            if (!slot) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Slot not found'
                });
            }

            if (slot.therapist.toString() !== req.user.id) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Not authorized to update this slot'
                });
            }

            const updatedSlot = await slotRepository.updateStatus(req.params.id, status);

            return res.status(200).json({
                status: 'success',
                data: updatedSlot
            });
        } catch (error) {
            console.error('[Update Slot Error]:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error updating slot'
            });
        }
    }
}

// Create decorated controllers
const listSlots = new ListSlotsController();
const createSlot = new AuthenticationDecorator(
    new RoleAuthorizationDecorator(
        new CreateSlotController(),
        ['therapist']
    )
);
const getSlot = new AuthenticationDecorator(new GetSlotController());
const updateSlot = new AuthenticationDecorator(
    new RoleAuthorizationDecorator(
        new UpdateSlotController(),
        ['therapist']
    )
);

// Routes
router.get('/', (req, res) => listSlots.execute(req, res));
router.post('/', (req, res, next) => createSlot.execute(req, res, next));
router.get('/:id', (req, res, next) => getSlot.execute(req, res, next));
router.put('/:id', (req, res, next) => updateSlot.execute(req, res, next));

module.exports = router;
