const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
  start:     { type: Date, required: true, index: true },
  end:       { type: Date, required: true },
  isBooked:  { type: Boolean, default: false, index: true }
}, { timestamps: true });

slotSchema.index({ therapist: 1, start: 1, end: 1 }, { unique: true });

slotSchema.pre('save', function(next) {
  if (this.start >= this.end) return next(new Error('slot start must be before end'));
  next();
});

module.exports = mongoose.model('Slot', slotSchema);
