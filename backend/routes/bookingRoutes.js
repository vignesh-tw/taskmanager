const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const c = require('../controllers/bookingController');

const router = express.Router();
router.post('/', protect, c.createBooking);
router.get('/my', protect, c.myBookings);
router.delete('/:id', protect, c.cancelBooking);
module.exports = router;
