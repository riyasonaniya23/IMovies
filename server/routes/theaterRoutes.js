const express = require('express');
const router = express.Router();
const {
  getTheaters,
  createTheater,
  deleteTheater,
} = require('../controllers/theaterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getTheaters).post(protect, adminOnly, createTheater);
router.route('/:id').delete(protect, adminOnly, deleteTheater);

module.exports = router;
