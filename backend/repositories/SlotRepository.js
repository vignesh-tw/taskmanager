const BaseRepository = require('./BaseRepository');
const Slot = require('../models/Slot');

/**
 * SlotRepository implementing the Repository Pattern for Slot-specific operations
 */
class SlotRepository extends BaseRepository {
  constructor() {
    super(Slot);
  }

  /**
   * Find available slots for a therapist
   */
  async findAvailableSlots(therapistId, startDate, endDate) {
    return this.find({
      therapist: therapistId,
      start: { $gte: startDate },
      end: { $lte: endDate },
      isBooked: false,
      status: 'available'
    }, {
      sort: { start: 1 }
    });
  }

  /**
   * Create multiple slots
   */
  async createMany(slots) {
    try {
      return await this.model.insertMany(slots, { ordered: false });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find overlapping slots
   */
  async findOverlapping(therapistId, start, end) {
    return this.find({
      therapist: therapistId,
      $or: [
        { start: { $lt: end }, end: { $gt: start } },
        { start: { $gte: start, $lt: end } },
        { end: { $gt: start, $lte: end } }
      ]
    });
  }

  /**
   * Update slot status
   */
  async updateStatus(slotId, status) {
    return this.update(slotId, { status });
  }

  /**
   * Find slots by time range
   */
  async findByTimeRange(startDate, endDate, options = {}) {
    const query = {
      start: { $gte: startDate },
      end: { $lte: endDate }
    };

    if (options.therapistId) {
      query.therapist = options.therapistId;
    }
    if (options.status) {
      query.status = options.status;
    }

    return this.find(query, {
      sort: { start: 1 },
      populate: ['therapist']
    });
  }

  /**
   * Cancel slot
   */
  async cancelSlot(slotId) {
    const slot = await this.findById(slotId);
    if (!slot) throw new Error('Slot not found');
    
    slot.isBooked = false;
    slot.status = 'available';
    return slot.save();
  }
}

module.exports = SlotRepository;