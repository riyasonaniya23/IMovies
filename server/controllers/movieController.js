const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies with optional search, genre, and language filters
// @route   GET /api/movies
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (genre && genre !== 'All') {
      filter.genre = { $in: [genre] };
    }
    if (language && language !== 'All') {
      filter.language = language;
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single movie by ID with reviews
// @route   GET /api/movies/:id
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    const reviews = await Review.find({ movie: movie._id }).sort({ createdAt: -1 });
    res.json({ ...movie.toObject(), reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      rating,
      cast,
      director,
      posterUrl,
      bannerUrl,
      trailerUrl,
    } = req.body;

    const parsedGenre = Array.isArray(genre)
      ? genre
      : typeof genre === 'string'
      ? genre.split(',').map((g) => g.trim()).filter(Boolean)
      : ['Action', 'Drama'];

    const parsedCast = Array.isArray(cast)
      ? cast
      : typeof cast === 'string'
      ? cast.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    const movie = await Movie.create({
      title,
      description,
      genre: parsedGenre,
      language,
      duration: Number(duration) || 135,
      releaseDate: releaseDate || new Date(),
      rating: Number(rating) || 8.5,
      cast: parsedCast,
      director: director || 'Featured Director',
      posterUrl,
      bannerUrl: bannerUrl || posterUrl,
      trailerUrl,
    });

    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a movie (Admin)
// @route   PUT /api/movies/:id
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    const updatedData = { ...req.body };
    if (typeof updatedData.genre === 'string') {
      updatedData.genre = updatedData.genre.split(',').map((g) => g.trim());
    }
    if (typeof updatedData.cast === 'string') {
      updatedData.cast = updatedData.cast.split(',').map((c) => c.trim());
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedMovie);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a movie (Admin)
// @route   DELETE /api/movies/:id
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }
    res.json({ message: 'Movie removed successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a review to a movie
// @route   POST /api/movies/:id/reviews
const addMovieReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404);
      throw new Error('Movie not found');
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      movie: movie._id,
      rating: Number(rating),
      comment,
    });

    const allReviews = await Review.find({ movie: movie._id });
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
    movie.rating = Number(avgRating.toFixed(1));
    await movie.save();

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  addMovieReview,
};
