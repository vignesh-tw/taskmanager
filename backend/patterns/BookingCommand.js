/**
 * Command Pattern implementation for booking operations
 * Encapsulates booking requests as objects
 */

// Command interface
class BookingCommand {
  execute() {
    throw new Error("execute method must be implemented");
  }

  undo() {
    throw new Error("undo method must be implemented");
  }
}

// Concrete Commands
class CreateBookingCommand extends BookingCommand {
  constructor(bookingRepository, bookingData) {
    super();
    this.bookingRepository = bookingRepository;
    this.bookingData = bookingData;
    this.createdBooking = null;
  }

  async execute() {
    try {
      this.createdBooking = await this.bookingRepository.createBooking(
        this.bookingData.patient,
        this.bookingData.slot,
        this.bookingData.paymentMethod,
      );
      return this.createdBooking;
    } catch (error) {
      // Ensure error has a status code
      if (!error.status) {
        error.status = error.name === "ValidationError" ? 400 : 500;
      }
      throw error;
    }
  }

  async undo() {
    if (!this.createdBooking) return;
    try {
      await this.bookingRepository.cancelBooking(this.createdBooking._id);
    } catch (error) {
      console.error("Failed to undo booking creation:", error);
    }
  }
}

class CancelBookingCommand extends BookingCommand {
  constructor(bookingRepository, bookingId, userId) {
    super();
    this.bookingRepository = bookingRepository;
    this.bookingId = bookingId;
    this.userId = userId;
    this.cancelledBooking = null;
  }

  async execute() {
    this.cancelledBooking = await this.bookingRepository.cancelBooking(
      this.bookingId,
      this.userId,
    );
    return this.cancelledBooking;
  }

  async undo() {
    if (!this.cancelledBooking) return;
    try {
      await this.bookingRepository.update(this.bookingId, {
        status: "confirmed",
      });
    } catch (error) {
      console.error("Failed to undo booking cancellation:", error);
    }
  }
}

// Command Invoker
class BookingCommandInvoker {
  constructor() {
    this.history = [];
  }

  async executeCommand(command) {
    try {
      const result = await command.execute();
      this.history.push(command);
      return result;
    } catch (error) {
      // Attempt to undo in case of error
      await command.undo();
      throw error;
    }
  }

  async undoLastCommand() {
    const command = this.history.pop();
    if (command) {
      await command.undo();
    }
  }
}

module.exports = {
  CreateBookingCommand,
  CancelBookingCommand,
  BookingCommandInvoker,
};
