const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const c = require('../controllers/slotController');

const router = express.Router();
router.get('/', c.listSlots);
router.post('/', protect, c.createSlot);
module.exports = router;
