import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user?.token) {
      API.get('/auth/profile')
        .then((res) => {
          setWatchlist(res.data.watchlist || []);
        })
        .catch(() => {});
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('imovies_user', JSON.stringify(data));
    setUser(data);
    setWatchlist(data.watchlist || []);
    return data;
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    localStorage.setItem('imovies_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('imovies_user');
    setUser(null);
    setWatchlist([]);
  };

  const toggleWatchlist = async (movieId) => {
    if (!user) return;
    const { data } = await API.post(`/auth/watchlist/${movieId}`);
    setWatchlist(data);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, watchlist, login, register, logout, toggleWatchlist }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
