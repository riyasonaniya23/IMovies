import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(email, password);
      if (data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('admin123');
    } else {
      setEmail('sarah@imovies.com');
      setPassword('user123');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card-dark p-4 shadow">
            <h3 className="fw-bold mb-1 text-center">Welcome Back</h3>
            <p className="text-secondary small text-center mb-4">
              Sign in to book tickets and manage your reservations
            </p>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="sarah@imovies.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="form-label small text-secondary">Password</label>
                <input
                  type="password"
                  required
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-danger w-100 fw-semibold py-2">
                Sign In
              </button>
            </form>

            <div className="mt-3 d-flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="btn btn-outline-secondary btn-sm w-50 text-light"
              >
                Demo User Login
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="btn btn-outline-info btn-sm w-50"
              >
                Demo Admin Login
              </button>
            </div>

            <p className="text-center text-secondary small mt-4 mb-0">
              New to IMovies?{' '}
              <Link to="/register" className="text-danger text-decoration-none fw-semibold">
                Create an Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
