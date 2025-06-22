// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('user');
  const token = localStorage.getItem('jwtToken');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
      <div className="flex items-center space-x-2">
        <img src="/logo192.png" alt="Logo" className="w-6 h-6" />
        <Link to="/" className="text-blue-800 font-bold text-lg">EffectiveTest</Link>
      </div>
      <nav className="flex items-center space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/new-test" className="hover:underline">Tests</Link>
        <Link to="/history" className="hover:underline">History</Link>
        <Link to="/compare" className="hover:underline">Compare</Link>

        {token ? (
          <>
            <span className="text-sm text-gray-700">👤 {username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
