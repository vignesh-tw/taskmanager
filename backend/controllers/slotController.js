const Slot = require('../models/Slot');


exports.createSlot = async (req, res) => {
  try {
    const { therapistId, start, end } = req.body;
    const slot = await Slot.create({ therapist: therapistId, start, end });
    res.status(201).json(slot);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.listSlots = async (req, res) => {
  try {
    const { therapistId, from, to, onlyOpen } = req.query;
    const q = {};
    if (therapistId) q.therapist = therapistId;
    if (from || to) q.start = {};
    if (from) q.start.$gte = new Date(from);
    if (to)   q.start.$lte = new Date(to);
    if (onlyOpen === 'true') q.isBooked = false;

    res.json(await Slot.find(q).sort({ start: 1 }));
  } catch (e) { res.status(500).json({ message: e.message }); }
};
