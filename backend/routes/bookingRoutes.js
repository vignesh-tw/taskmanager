const express = require('express');
const { AuthenticationDecorator, RoleAuthorizationDecorator } = require('../patterns/AuthDecorator');
const { PaymentProcessor, PaymentStrategyFactory } = require('../patterns/PaymentStrategy');
const { NotificationManager, NotificationFactory, NotificationEvents, NotificationEventBuilder } = require('../patterns/NotificationObserver');
const repositoryFactory = require('../repositories/RepositoryFactory');
const router = express.Router();

// Initialize repositories
const bookingRepository = repositoryFactory.getRepository('booking');

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();

// Initialize notification system
const notificationManager = new NotificationManager();
const notificationObservers = NotificationFactory.createObservers(['email', 'sms']);
notificationManager.attach(NotificationEvents.BOOKING_CREATED, notificationObservers.get('email'));
notificationManager.attach(NotificationEvents.BOOKING_CANCELLED, notificationObservers.get('email'));

// Base controller for creating booking
class CreateBookingController {
    async execute(req, res) {
        try {
            const { slotId, paymentMethod } = req.body;
            if (!paymentMethod) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Payment method is required'
                });
            }

            // Process payment
            const paymentStrategy = PaymentStrategyFactory.createStrategy(paymentMethod, {});
            paymentProcessor.setStrategy(paymentStrategy);

            try {
                // Create booking using repository
                const booking = await bookingRepository.createBooking(
                    req.user._id,
                    slotId,
                    paymentMethod
                );

                // Send notifications
                const notificationEvent = new NotificationEventBuilder(NotificationEvents.BOOKING_CREATED)
                    .setRecipient(req.user.email)
                    .setSubject('Booking Confirmation')
                    .setContent(`Your booking has been confirmed`)
                    .setData(booking)
                    .build();

                await notificationManager.notify(notificationEvent);

                return res.status(201).json({
                    status: 'success',
                    data: booking
                });
            } catch (error) {
                // Handle specific error cases
                if (error.status) {
                    return res.status(error.status).json({
                        status: 'error',
                        message: error.message
                    });
                }
                throw error;
            }
        } catch (error) {
            console.error('[Create Booking Error]:', error);
            return res.status(error.status || 500).json({
                status: 'error',
                message: error.message || 'Error creating booking'
            });
        }
    }
}

// Base controller for listing user's bookings
class ListBookingsController {
    async execute(req, res) {
        try {
            const bookings = await bookingRepository.getUserBookings(req.user._id);

            return res.status(200).json({
                status: 'success',
                data: bookings
            });
        } catch (error) {
            console.error('[List Bookings Error]:', error);
            return res.status(error.status || 500).json({
                status: 'error',
                message: error.message || 'Error fetching bookings'
            });
        }
    }
}

// Base controller for cancelling booking
class CancelBookingController {
    async execute(req, res) {
        try {
            const { reason } = req.body;
            const booking = await bookingRepository.cancelBooking(req.params.id, req.user._id);

            // Send cancellation notification
            const notificationEvent = new NotificationEventBuilder(NotificationEvents.BOOKING_CANCELLED)
                .setRecipient(req.user.email)
                .setSubject('Booking Cancelled')
                .setContent(`Your booking has been cancelled`)
                .setData({ bookingId: req.params.id, reason })
                .build();

            await notificationManager.notify(notificationEvent);

            return res.status(200).json({
                status: 'success',
                message: 'Booking cancelled successfully'
            });
        } catch (error) {
            console.error('[Cancel Booking Error]:', error);
            return res.status(error.status || 500).json({
                status: 'error',
                message: error.message || 'Error cancelling booking'
            });
        }
    }
}

// Create decorated controllers
const createBooking = new AuthenticationDecorator(new CreateBookingController());
const listBookings = new AuthenticationDecorator(new ListBookingsController());
const cancelBooking = new AuthenticationDecorator(new CancelBookingController());

// Routes
router.post('/', (req, res, next) => createBooking.execute(req, res, next));
router.get('/my', (req, res, next) => listBookings.execute(req, res, next));
router.delete('/:id', (req, res, next) => cancelBooking.execute(req, res, next));

module.exports = router;