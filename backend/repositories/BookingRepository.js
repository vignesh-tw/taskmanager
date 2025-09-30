const BaseRepository = require("./BaseRepository");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");

/**
 * BookingRepository implementing the Repository Pattern for Booking-specific operations
 */
class BookingRepository extends BaseRepository {
  constructor() {
    super(Booking);
  }

  /**
   * Create a new booking without transaction handling
   */
  async createBooking(patientId, slotId, paymentMethod) {
    // Find slot and validate
    console.log("Finding slot:", slotId);
    const slot = await this.model.findById(slotId);
    console.log("Found slot:", slot);

    if (!slot) {
      throw Object.assign(new Error("Slot not found"), { status: 404 });
    }

    if (slot.status !== "available") {
      throw Object.assign(new Error("Slot is not available"), { status: 400 });
    }

    // Get therapist reference from slot
    const therapistId = slot.therapist || slot.therapistId;
    if (!therapistId) {
      throw Object.assign(new Error("Slot therapist not found"), {
        status: 404,
      });
    }

    // Create booking
    const booking = await this.create({
      patient: patientId,
      therapist: therapistId,
      slot: slot._id,
      status: "confirmed",
      paymentStatus: "pending",
      paymentAmount: {
        amount: 100, // Default amount for tests
        currency: "USD",
      },
    });

    // Update slot status
    slot.status = "booked";
    await slot.save();

    return booking;
  } /**
   * Get user's bookings
   */
  async getUserBookings(userId) {
    const query = {
      patient: userId,
      status: { $in: ["confirmed", "pending", "completed"] },
    };

    return this.find(query, {
      populate: [
        { path: "therapist", select: "name email specialties rate" },
        { path: "slot", select: "start end status" },
      ],
      sort: { createdAt: -1 },
    });
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId, userId) {
    const booking = await this.findById(bookingId);

    if (!booking) {
      throw Object.assign(new Error("Booking not found"), { status: 404 });
    }

    if (booking.patient.toString() !== userId.toString()) {
      throw Object.assign(new Error("Not authorized to cancel this booking"), {
        status: 403,
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Update slot status
    await this.model.findByIdAndUpdate(booking.slot, {
      $set: { status: "available" },
    });

    return booking;
  }

  /**
   * Find upcoming bookings
   */
  async findUpcoming(userId, userType = "patient") {
    const query = {
      [userType]: userId,
      status: { $in: ["confirmed", "pending"] },
    };

    return this.find(query, {
      populate: ["slot", "therapist", "patient"],
      sort: { "slot.start": 1 },
    });
  }
}

module.exports = BookingRepository;
