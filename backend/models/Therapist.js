const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  name:   { type: String, required: true, trim: true },
  specialties: [String],            
  languages:   [String],            
  rate:   { type: Number, required: true, min: 0 }, 
  bio:    { type: String, maxlength: 2000 }
}, { timestamps: true });

therapistSchema.index({ userId: 1 }, { unique: true }); 

module.exports = mongoose.model('Therapist', therapistSchema);
