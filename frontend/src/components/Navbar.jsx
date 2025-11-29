import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/locations">🎭 Cultural Events</Link>
      </div>

      <ul className="navbar-menu">
        <li><Link to="/locations">Venues</Link></li>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/favorites">❤️ Favorites</Link></li>
        <li>
          <Link to="/admin" className={user.role !== 'admin' ? 'hidden' : ''}>
            ⚙️ Admin
          </Link>
        </li>
      </ul>

      <div className="navbar-user">
        <span>👤 {user.username}</span>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;