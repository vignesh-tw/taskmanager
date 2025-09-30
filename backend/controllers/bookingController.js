const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const repositoryFactory = require('../repositories/RepositoryFactory');

exports.createBooking = async (req, res) => {
  try {
    const bookingRepository = repositoryFactory.getRepository('booking');
    const { slotId, paymentMethod } = req.body;

    // Validate payment method
    if (!paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment method is required'
      });
    }

    // Create booking using repository
    const booking = await bookingRepository.createBooking(req.user._id, slotId, paymentMethod);

    // Return booking with populated data
    const confirmedBooking = await Booking.findById(booking._id)
      .populate('therapist')
      .populate('slot');

    return res.status(201).json({ 
      status: 'success', 
      data: confirmedBooking 
    });
  } catch (e) {
    // Log error for debugging
    console.error('[Create Booking Error]:', e);
    
    // Handle all errors with their proper status codes
    return res.status(e.status || 500).json({ 
      status: 'error', 
      message: e.message || 'Internal server error'
    }); 
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookingRepository = repositoryFactory.getRepository('booking');
    const list = await bookingRepository.getUserBookings(req.user._id);

    return res.status(200).json({ 
      status: 'success', 
      count: list.length,
      data: list 
    });
  } catch (e) {
    console.error('[myBookings] Error:', e);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Error fetching bookings',
      error: e.message
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingRepository = repositoryFactory.getRepository('booking');
    const booking = await bookingRepository.cancelBooking(req.params.id, req.user._id);

    res.json({ 
      status: 'success', 
      data: booking,
      message: 'Booking cancelled successfully' 
    });
  } catch (error) {
    console.error('[Cancel Booking Error]:', error);
    res.status(error.status || 500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
};
