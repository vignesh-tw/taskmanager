const mongoose = require("mongoose");

/**
 * Slot class implementing the core time slot functionality
 * Demonstrates encapsulation and validation logic
 */
const slotSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
      index: true,
    },
    start: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Slot start time must be in the future",
      },
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.start;
        },
        message: "End time must be after start time",
      },
    },
    status: {
      type: String,
      enum: ["available", "booked", "cancelled", "completed"],
      default: "available",
      index: true,
      validate: {
        validator: function (value) {
          if (this.isNew && value !== "available") {
            return false;
          }
          return ["available", "booked", "cancelled", "completed"].includes(
            value,
          );
        },
        message: "Invalid slot status",
      },
    },
    duration: {
      type: Number,
      min: [30, "Session duration must be at least 30 minutes"],
      max: [180, "Session duration cannot exceed 180 minutes"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound index for unique slot per therapist
slotSchema.index({ therapist: 1, start: 1, end: 1 }, { unique: true });

// Virtual for formatted time range
slotSchema.virtual("timeRange").get(function () {
  return `${this.start.toLocaleTimeString()} - ${this.end.toLocaleTimeString()}`;
});

// Virtual for checking if slot is in the past
slotSchema.virtual("isPast").get(function () {
  return this.end < new Date();
});

// Pre-save middleware for validation
slotSchema.pre("save", function (next) {
  // Calculate duration in minutes
  this.duration = (this.end - this.start) / (1000 * 60);

  // Validate business hours (9 AM to 5 PM)
  const startHour = this.start.getHours();
  const endHour = this.end.getHours();

  if (startHour < 9 || endHour > 17) {
    const error = new Error(
      "Slots must be within business hours (9 AM to 5 PM)",
    );
    error.status = 400;
    return next(error);
  }

  next();
});

// Instance method to check slot availability
slotSchema.methods.isAvailable = function () {
  return this.status === "available" && this.start > new Date();
};

// Instance method to book a slot
slotSchema.methods.book = function () {
  if (!this.isAvailable()) {
    const error = new Error("Slot is not available for booking");
    error.status = 400;
    throw error;
  }
  this.status = "booked";
  return this.save();
};

// Instance method to cancel a booking
slotSchema.methods.cancel = function () {
  if (this.status !== "booked") {
    throw new Error("Can only cancel booked slots");
  }
  if (this.start <= new Date()) {
    throw new Error("Cannot cancel past or ongoing slots");
  }
  this.isBooked = false;
  this.status = "cancelled";
  return this.save();
};

// Static method to find available slots for a therapist
slotSchema.statics.findAvailableSlots = function (
  therapistId,
  startDate,
  endDate,
) {
  return this.find({
    therapist: therapistId,
    start: { $gte: startDate },
    end: { $lte: endDate },
    isBooked: false,
    status: "available",
  }).sort("start");
};

// Static method to find overlapping slots
slotSchema.statics.findOverlapping = function (therapistId, start, end) {
  return this.find({
    therapist: therapistId,
    $or: [
      { start: { $lt: end }, end: { $gt: start } },
      { start: { $gte: start, $lt: end } },
      { end: { $gt: start, $lte: end } },
    ],
  });
};

module.exports = mongoose.model("Slot", slotSchema);
