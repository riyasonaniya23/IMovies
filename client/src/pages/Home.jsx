import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import MovieCard from '../components/MovieCard';
import { FaSearch, FaFilter } from 'react-icons/fa';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Thriller', 'Animation', 'Biography'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil'];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/movies', {
        params: { search, genre, language },
      });
      setMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [genre, language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="container py-4">
      <div className="hero-banner mb-5">
        <div className="col-lg-8">
          <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase">Now Showing in IMAX & 4DX</span>
          <h1 className="display-5 fw-bold mb-3">
            Book Movie Tickets Seamlessly with <span className="text-danger">IMovies</span>
          </h1>
          <p className="lead text-light opacity-75 mb-4">
            Browse blockbuster releases, check real-time seat layouts across top multiplexes, and reserve your seats instantly.
          </p>

          <form onSubmit={handleSearchSubmit} className="row g-2">
            <div className="col-sm-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Search movies by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <button type="submit" className="btn btn-danger btn-lg w-100 fw-semibold">
                Search Movies
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card-dark p-3 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="text-secondary small fw-semibold me-2 d-flex align-items-center gap-1">
            <FaFilter /> Genre:
          </span>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`btn btn-sm rounded-pill px-3 ${
                genre === g ? 'btn-danger' : 'btn-outline-secondary text-light'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary small fw-semibold">Language:</span>
          <select
            className="form-select form-select-sm bg-dark text-light border-secondary"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-secondary">Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="card-dark p-5 text-center">
          <h5>No movies found matching your filters</h5>
          <button
            className="btn btn-outline-danger btn-sm mt-2"
            onClick={() => {
              setSearch('');
              setGenre('All');
              setLanguage('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {movies.map((movie) => (
            <div key={movie._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
