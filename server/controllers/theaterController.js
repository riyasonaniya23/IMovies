const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
const getTheaters = async (req, res, next) => {
  try {
    const theaters = await Theater.find().sort({ name: 1 });
    res.json(theaters);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new theater (Admin)
// @route   POST /api/theaters
const createTheater = async (req, res, next) => {
  try {
    const { name, location, city, totalScreens, facilities } = req.body;
    const parsedFacilities = Array.isArray(facilities)
      ? facilities
      : typeof facilities === 'string'
      ? facilities.split(',').map((f) => f.trim()).filter(Boolean)
      : ['Dolby Atmos', '4K Projection', 'Food Court'];

    const theater = await Theater.create({
      name,
      location,
      city: city || 'Mumbai',
      totalScreens: Number(totalScreens) || 4,
      facilities: parsedFacilities,
    });
    res.status(201).json(theater);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a theater (Admin)
// @route   DELETE /api/theaters/:id
const deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) {
      res.status(404);
      throw new Error('Theater not found');
    }
    res.json({ message: 'Theater deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTheaters,
  createTheater,
  deleteTheater,
};
