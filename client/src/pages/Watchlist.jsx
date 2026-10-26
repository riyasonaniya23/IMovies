import React from 'react';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import { FaHeart } from 'react-icons/fa';

const Watchlist = () => {
  const { watchlist } = useAuth();

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <FaHeart className="text-danger" /> My Saved Watchlist
      </h3>

      {!watchlist || watchlist.length === 0 ? (
        <div className="card-dark p-5 text-center">
          <h5>Your watchlist is empty</h5>
          <p className="text-secondary mb-0">
            Click the heart icon on any movie card to save it for later.
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {watchlist.map((movie) => (
            <div key={movie._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
