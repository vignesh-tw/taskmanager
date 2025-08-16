const Therapist = require('../models/Therapist');

exports.createTherapist = async (req, res) => {
  try {
    const { name, specialties = [], languages = [], rate, bio = '' } = req.body;
    const doc = await Therapist.create({ userId: req.user._id, name, specialties, languages, rate, bio });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.listTherapists = async (_req, res) => {
  try { res.json(await Therapist.find().sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getTherapist = async (req, res) => {
  const doc = await Therapist.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};
exports.updateTherapist = async (req, res) => {
  const doc = await Therapist.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: 'Not found or forbidden' });
  res.json(doc);
};
exports.removeTherapist = async (req, res) => {
  const rs = await Therapist.deleteOne({ _id: req.params.id, userId: req.user._id });
  if (rs.deletedCount !== 1) return res.status(404).json({ message: 'Not found or forbidden' });
  res.json({ ok: true });
};
