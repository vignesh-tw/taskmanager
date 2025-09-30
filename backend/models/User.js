const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Base User class implementing core functionality and enforcing OOP principles
 * - Encapsulation: Private fields through MongoDB schema
 * - Inheritance: Base class for Patient and Therapist
 * - Polymorphism: Abstract methods for profile data
 * - Abstraction: High-level interface for user operations
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    userType: {
      type: String,
      required: true,
      enum: ["patient", "therapist"],
      default: "patient",
      immutable: true, // Cannot change user type after creation
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "userType",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Encapsulation: Password hashing logic as a method
userSchema.methods.hashPassword = async function () {
  return await bcrypt.hash(this.password, 10);
};

// Middleware: Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await this.hashPassword();
  }
  next();
});

// Instance method for secure password comparison
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// Abstract method (to be implemented by subclasses)
userSchema.methods.getProfileData = function () {
  throw new Error("getProfileData must be implemented by subclass");
};

// Abstract method for notifications
userSchema.methods.sendNotification = function () {
  throw new Error("sendNotification must be implemented by subclass");
};

// Static factory method for creating user instances
userSchema.statics.createUser = async function (userData) {
  const UserModel = this.discriminators[userData.userType] || this;
  return new UserModel(userData);
};

// Virtual for full name (demonstration of computed property)
userSchema.virtual("fullName").get(function () {
  return `${this.name}`;
});

// Instance method for updating profile
userSchema.methods.updateProfile = async function (updateData) {
  const allowedUpdates = ["name", "email"];
  Object.keys(updateData).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      this[key] = updateData[key];
    }
  });
  return this.save();
};

// Static method for finding active users
userSchema.statics.findActive = function () {
  return this.find({ active: true });
};

const User = mongoose.model("User", userSchema);

// Patient subclass (inherits from User)
const patientSchema = new mongoose.Schema({
  university: { type: String, trim: true },
  address: { type: String, trim: true },
  dateOfBirth: { type: Date },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
  },
});

// Override the abstract method
patientSchema.methods.getProfileData = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    university: this.university,
    address: this.address,
    dateOfBirth: this.dateOfBirth,
    emergencyContact: this.emergencyContact,
  };
};

const Patient = User.discriminator("patient", patientSchema);

// Therapist subclass (inherits from User)
const therapistSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default: "", // URL to the profile picture
  },
  specialties: [{ type: String, trim: true }],
  languages: [{ type: String, trim: true }],
  rate: {
    amount: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, required: true, default: "USD" },
  },
  bio: { type: String, maxlength: 2000, trim: true },
  qualifications: [
    {
      degree: { type: String, trim: true },
      institution: { type: String, trim: true },
      year: { type: Number },
    },
  ],
  experience: { type: Number, min: 0, default: 0 }, // years of experience
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }],
  },
  isVerified: { type: Boolean, default: false },
});

// Override the abstract method
therapistSchema.methods.getProfileData = function () {
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
    isVerified: this.isVerified,
  };
};

const Therapist = User.discriminator("therapist", therapistSchema);

module.exports = { User, Patient, Therapist };
