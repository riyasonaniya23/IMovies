import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFilm, FaTicketAlt, FaHeart, FaUserShield, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { user, logout, watchlist } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
          <FaFilm className="text-danger fs-3" />
          <span>
            I<span className="text-danger">Movies</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="imoviesNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Movies
              </NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center gap-1" to="/my-bookings">
                    <FaTicketAlt className="text-danger" /> My Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link d-flex align-items-center gap-1" to="/watchlist">
                    <FaHeart className="text-warning" /> Watchlist
                    {watchlist?.length > 0 && (
                      <span className="badge bg-danger rounded-pill ms-1">
                        {watchlist.length}
                      </span>
                    )}
                  </NavLink>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link text-info fw-semibold d-flex align-items-center gap-1" to="/admin">
                  <FaUserShield /> Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-light text-decoration-none d-flex align-items-center gap-2"
                >
                  <FaUserCircle className="fs-4 text-danger" />
                  <span className="fw-medium">{user.name}</span>
                  <span className="badge bg-secondary text-uppercase">{user.role}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  Login
                </Link>
                <Link to="/register" className="btn btn-danger btn-sm px-3">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
