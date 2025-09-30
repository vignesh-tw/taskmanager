const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

// Base User schema with discriminator key for inheritance
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    userType: { 
      type: String, 
      required: true, 
      enum: ['patient', 'therapist'],
      default: 'patient'
    }
  },
  { 
    timestamps: true,
    discriminatorKey: 'userType' // Enable inheritance
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Abstract method to be overridden by subclasses
userSchema.methods.getProfileData = function() {
  throw new Error('getProfileData must be implemented by subclass');
};

// Factory method to create appropriate user type
userSchema.statics.createUser = function(userData) {
  const { userType } = userData;
  if (userType === 'therapist') {
    return new Therapist(userData);
  } else {
    return new Patient(userData);
  }
};

const User = mongoose.model('User', userSchema);

// Patient subclass (inherits from User)
const patientSchema = new mongoose.Schema({
  university: { type: String, trim: true },
  address: { type: String, trim: true },
  dateOfBirth: { type: Date },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true }
  }
});

// Override the abstract method
patientSchema.methods.getProfileData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    university: this.university,
    address: this.address,
    dateOfBirth: this.dateOfBirth,
    emergencyContact: this.emergencyContact
  };
};

const Patient = User.discriminator('patient', patientSchema);

// Therapist subclass (inherits from User) 
const therapistSchema = new mongoose.Schema({
  specialties: [{ type: String, trim: true }],
  languages: [{ type: String, trim: true }],
  rate: { type: Number, required: true, min: 0, default: 0 },
  bio: { type: String, maxlength: 2000, trim: true },
  qualifications: [{ 
    degree: { type: String, trim: true },
    institution: { type: String, trim: true },
    year: { type: Number }
  }],
  experience: { type: Number, min: 0, default: 0 }, // years of experience
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }]
  },
  isVerified: { type: Boolean, default: false }
});

// Override the abstract method
therapistSchema.methods.getProfileData = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    specialties: this.specialties,
    languages: this.languages,
    rate: this.rate,
    bio: this.bio,
    qualifications: this.qualifications,
    experience: this.experience,
    availability: this.availability,
    isVerified: this.isVerified
  };
};

const Therapist = User.discriminator('therapist', therapistSchema);

module.exports = { User, Patient, Therapist };
