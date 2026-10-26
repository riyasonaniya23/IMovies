const Show = require('../models/Show');

// @desc    Get shows (optionally filtered by movieId or date)
// @route   GET /api/shows
const getShows = async (req, res, next) => {
  try {
    const { movieId, date } = req.query;
    const filter = {};
    if (movieId) filter.movie = movieId;
    if (date) filter.showDate = date;

    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration language genre rating')
      .populate('theater', 'name location city facilities')
      .sort({ showDate: 1, showTime: 1 });

    res.json(shows);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single show details by ID (including real-time booked seats)
// @route   GET /api/shows/:id
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');
    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }
    res.json(show);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new show schedule (Admin)
// @route   POST /api/shows
const createShow = async (req, res, next) => {
  try {
    const {
      movie,
      theater,
      screenNumber,
      showDate,
      showTime,
      ticketPrice,
      vipPrice,
      totalSeats,
    } = req.body;

    const show = await Show.create({
      movie,
      theater,
      screenNumber: Number(screenNumber) || 1,
      showDate,
      showTime,
      ticketPrice: Number(ticketPrice) || 250,
      vipPrice: Number(vipPrice) || 400,
      totalSeats: Number(totalSeats) || 64,
      bookedSeats: [],
    });

    const populated = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theater', 'name location');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a show (Admin)
// @route   DELETE /api/shows/:id
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }
    res.json({ message: 'Show schedule removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  deleteShow,
};
