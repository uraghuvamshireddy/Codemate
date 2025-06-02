import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('name')
    const handleProfileClick = () => {
      console.log('profile')
    navigate('/profile');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="company-name">CODEMATE</div>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
        />
      </div>

      <div className="navbar-right">
        <button className="nav-button">Solutions</button>
        <button className="nav-button">Compare</button>

        <div className="profile">
          <div onClick={handleProfileClick} className="profile-icon"> {userName ? userName[0] : 'U'}</div>
          <span onClick={handleProfileClick} className="username">{userName || 'User'}</span>
        </div>

        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
