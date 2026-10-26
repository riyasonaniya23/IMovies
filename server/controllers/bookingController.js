const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const User = require('../models/User');

// @desc    Create new ticket booking & reserve seats
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { showId, seats, totalAmount, paymentMethod } = req.body;

    if (!seats || seats.length === 0) {
      res.status(400);
      throw new Error('Please select at least one seat');
    }

    const show = await Show.findById(showId);
    if (!show) {
      res.status(404);
      throw new Error('Show not found');
    }

    // Check real-time seat availability to prevent double-booking
    const alreadyBooked = seats.filter((seat) =>
      show.bookedSeats.includes(seat)
    );
    if (alreadyBooked.length > 0) {
      res.status(400);
      throw new Error(
        `Seats ${alreadyBooked.join(', ')} are already booked. Please choose different seats.`
      );
    }

    // Lock & confirm seats on the show document
    show.bookedSeats.push(...seats);
    await show.save();

    const paymentId = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      seats,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'UPI',
      paymentId,
      paymentStatus: 'Completed',
      bookingStatus: 'Confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration language genre' },
          { path: 'theater', select: 'name location city' },
        ],
      })
      .populate('user', 'name email phone');

    res.status(201).json(populatedBooking);
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/mybookings
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration language genre' },
          { path: 'theater', select: 'name location city' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a booking & release seats
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === 'Cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    // Release seats back to the show pool
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );
      await show.save();
    }

    res.json({ message: 'Booking cancelled and seats released', booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings & platform revenue stats (Admin)
// @route   GET /api/bookings/admin/all
const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl' },
          { path: 'theater', select: 'name location city' },
        ],
      })
      .sort({ createdAt: -1 });

    const confirmedBookings = bookings.filter(
      (b) => b.bookingStatus === 'Confirmed'
    );
    const totalRevenue = confirmedBookings.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const totalTicketsSold = confirmedBookings.reduce(
      (sum, item) => sum + item.seats.length,
      0
    );

    const [movieCount, theaterCount, showCount, userCount] = await Promise.all([
      Movie.countDocuments(),
      Theater.countDocuments(),
      Show.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      stats: {
        totalRevenue,
        totalTicketsSold,
        totalBookings: bookings.length,
        movieCount,
        theaterCount,
        showCount,
        userCount,
      },
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookingsAdmin,
};
