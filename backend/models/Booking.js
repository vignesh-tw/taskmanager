const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  slot:      { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true, unique: true }, 
  status:    { type: String, enum: ['confirmed','canceled'], default: 'confirmed', index: true },
  notes:     { type: String, maxlength: 2000 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
