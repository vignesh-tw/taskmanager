const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const c = require('../controllers/therapistController');

const router = express.Router();
router.get('/', c.listTherapists);
router.post('/', protect, c.createTherapist);
module.exports = router;
