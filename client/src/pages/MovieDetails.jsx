import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [rating, setRating] = useState(9);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const fetchMovieAndShows = async () => {
    try {
      const [movieRes, showsRes] = await Promise.all([
        API.get(`/movies/${id}`),
        API.get('/shows', { params: { movieId: id } }),
      ]);
      setMovie(movieRes.data);
      setShows(showsRes.data);
      if (showsRes.data.length > 0 && !selectedDate) {
        setSelectedDate(showsRes.data[0].showDate);
      }
    } catch (err) {
      console.error('Error loading movie details:', err);
    }
  };

  useEffect(() => {
    fetchMovieAndShows();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await API.post(`/movies/${id}/reviews`, { rating, comment });
      setComment('');
      setReviewMsg('Review submitted! Thank you for your feedback.');
      fetchMovieAndShows();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review');
    }
  };

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger"></div>
      </div>
    );
  }

  const availableDates = [...new Set(shows.map((s) => s.showDate))];
  const filteredShows = selectedDate
    ? shows.filter((s) => s.showDate === selectedDate)
    : shows;

  // Group shows by theater
  const theatersMap = {};
  filteredShows.forEach((show) => {
    const tId = show.theater?._id;
    if (!tId) return;
    if (!theatersMap[tId]) {
      theatersMap[tId] = {
        theater: show.theater,
        shows: [],
      };
    }
    theatersMap[tId].shows.push(show);
  });

  return (
    <div className="container py-4">
      {/* Movie Overview Header */}
      <div className="card-dark p-4 mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-9">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-danger px-3 py-2">{movie.language}</span>
              {movie.genre?.map((g) => (
                <span key={g} className="badge bg-secondary bg-opacity-50 px-3 py-2">
                  {g}
                </span>
              ))}
              <span className="badge bg-warning text-dark d-flex align-items-center gap-1 px-3 py-2">
                <FaStar /> {movie.rating}/10
              </span>
            </div>

            <h2 className="fw-bold mb-3">{movie.title}</h2>
            <p className="text-light opacity-75 mb-3">{movie.description}</p>

            <div className="row g-3 text-secondary small mb-3">
              <div className="col-sm-4">
                <strong className="text-light d-block">Director</strong>
                {movie.director}
              </div>
              <div className="col-sm-4">
                <strong className="text-light d-block">Duration</strong>
                <FaClock className="me-1" /> {movie.duration} mins
              </div>
              <div className="col-sm-4">
                <strong className="text-light d-block">Release Date</strong>
                <FaCalendarAlt className="me-1" />{' '}
                {new Date(movie.releaseDate).toLocaleDateString()}
              </div>
            </div>

            {movie.cast?.length > 0 && (
              <div>
                <strong className="text-light small d-block mb-1">Cast:</strong>
                <div className="d-flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="badge bg-dark border border-secondary fw-normal px-3 py-2"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Showtimes & Theaters Section */}
      <div className="card-dark p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <FaTicketAlt className="text-danger" /> Select Theater & Showtime
          </h4>
          <div className="d-flex gap-2">
            {availableDates.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`btn btn-sm px-3 ${
                  selectedDate === d ? 'btn-danger' : 'btn-outline-secondary text-light'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {Object.values(theatersMap).length === 0 ? (
          <p className="text-secondary mb-0">No showtimes scheduled for this date.</p>
        ) : (
          Object.values(theatersMap).map(({ theater, shows: tShows }) => (
            <div
              key={theater._id}
              className="border-top border-secondary border-opacity-25 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
            >
              <div>
                <h5 className="fw-bold mb-1">{theater.name}</h5>
                <p className="text-secondary small mb-1 d-flex align-items-center gap-1">
                  <FaMapMarkerAlt className="text-danger" /> {theater.location}, {theater.city}
                </p>
                <div className="d-flex flex-wrap gap-1">
                  {theater.facilities?.map((fac) => (
                    <span key={fac} className="badge bg-dark text-secondary border border-secondary border-opacity-25">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {tShows.map((show) => (
                  <Link
                    key={show._id}
                    to={`/book/${show._id}`}
                    className="btn btn-outline-success px-3 py-2 text-center"
                  >
                    <div className="fw-bold">{show.showTime}</div>
                    <div className="small text-secondary">
                      Screen {show.screenNumber} • ₹{show.ticketPrice}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Reviews & Ratings */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card-dark p-4 h-100">
            <h5 className="fw-bold mb-3">Audience Reviews ({movie.reviews?.length || 0})</h5>
            {movie.reviews?.length === 0 ? (
              <p className="text-secondary">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {movie.reviews?.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-3 rounded bg-dark border border-secondary border-opacity-25"
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{rev.userName}</strong>
                      <span className="badge bg-warning text-dark">
                        ★ {rev.rating}/10
                      </span>
                    </div>
                    <p className="text-light opacity-75 small mb-0">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-dark p-4">
            <h5 className="fw-bold mb-3">Write a Review</h5>
            {reviewMsg && <div className="alert alert-info py-2 small">{reviewMsg}</div>}
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Rating (1 - 10)</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Stars
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Your Review</label>
                <textarea
                  rows="3"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Share your thoughts on the movie..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-semibold">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
