const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { slotId, therapistId, notes } = req.body;

    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, therapist: therapistId, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );
    if (!slot) return res.status(409).json({ message: 'Slot not available' });

    const booking = await Booking.create({
      user: req.user._id, therapist: therapistId, slot: slot._id, notes
    });
    res.status(201).json(booking);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.myBookings = async (req, res) => {
  const list = await Booking.find({ user: req.user._id }).populate('therapist').populate('slot').sort({ createdAt: -1 });
  res.json(list);
};

exports.cancelBooking = async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return res.status(404).json({ message: 'Not found' });
  if (b.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

  b.status = 'canceled'; await b.save();
  await Slot.updateOne({ _id: b.slot }, { $set: { isBooked: false } });
  res.json({ message: 'Booking canceled' });
};
