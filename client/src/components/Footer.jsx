import React from 'react';
import { FaFilm } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-top border-secondary border-opacity-25 py-4 mt-5 bg-dark">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small">
        <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
          <FaFilm className="text-danger fs-5" />
          <span className="fw-bold text-light">IMovies</span>
          <span>— Movie Ticket Booking Made Simple (MERN Stack)</span>
        </div>
        <div>
          © {new Date().getFullYear()} IMovies Cinema Platform. Built with React, Node.js, Express & MongoDB.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
