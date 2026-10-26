import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie }) => {
  const { user, watchlist, toggleWatchlist } = useAuth();
  const isSaved = watchlist?.some((item) => (item._id || item) === movie._id);

  return (
    <div className="movie-card h-100 d-flex flex-column">
      <div className="position-relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 d-flex align-items-center gap-1 px-2 py-1">
          <FaStar className="text-warning" /> {movie.rating}/10
        </span>
        {user && (
          <button
            onClick={() => toggleWatchlist(movie._id)}
            className="btn btn-sm btn-dark bg-opacity-75 position-absolute top-0 end-0 m-2 rounded-circle"
            title="Toggle Watchlist"
          >
            {isSaved ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-light" />}
          </button>
        )}
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <h5 className="fw-bold mb-1 text-truncate" title={movie.title}>
          {movie.title}
        </h5>
        <p className="text-secondary small mb-2">
          {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
        </p>
        <div className="d-flex justify-content-between align-items-center text-secondary small mb-3">
          <span>{movie.language}</span>
          <span className="d-flex align-items-center gap-1">
            <FaClock /> {movie.duration} mins
          </span>
        </div>

        <Link
          to={`/movies/${movie._id}`}
          className="btn btn-danger w-100 mt-auto fw-semibold"
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
