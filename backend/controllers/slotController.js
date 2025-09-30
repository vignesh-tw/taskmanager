const Slot = require("../models/Slot");
const mongoose = require("mongoose");

exports.createSlot = async (req, res) => {
  try {
    const { therapistId, start, end } = req.body;
    const slot = await Slot.create({
      therapist: therapistId,
      start,
      end,
      status: "available",
    });
    res.status(201).json({
      status: "success",
      data: slot,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
};

exports.listSlots = async (req, res) => {
  try {
    const { therapistId, from, to } = req.query;
    const q = {};

    // Base query - only show future available slots
    q.start = { $gt: new Date() };
    q.status = "available";

    // Handle therapist filtering
    if (therapistId && therapistId !== "undefined") {
      if (!mongoose.Types.ObjectId.isValid(therapistId)) {
        // Return empty results for invalid IDs
        return res.status(200).json({
          status: "success",
          count: 0,
          data: [],
        });
      }
      q.therapist = therapistId;
    }

    // Handle date filtering
    if (from && from !== "undefined") {
      const fromDate = new Date(from);
      if (!isNaN(fromDate)) {
        q.start = { ...q.start, $gte: fromDate };
      }
    }

    if (to && to !== "undefined") {
      const toDate = new Date(to);
      if (!isNaN(toDate)) {
        q.start = { ...q.start, $lte: toDate };
      }
    }

    // Get slots with populated therapist info
    const slots = await Slot.find(q)
      .populate({
        path: "therapist",
        select: "name specialties rate",
      })
      .sort({ start: 1 })
      .lean();

    // Always return 200 with result metadata
    return res.status(200).json({
      status: "success",
      count: slots.length,
      data: slots,
    });
  } catch (e) {
    // Log error for debugging
    console.error("[listSlots] Error:", e);

    // Return 500 for server errors only
    return res.status(500).json({
      status: "error",
      message: "Error retrieving slots",
    });
  }
};
