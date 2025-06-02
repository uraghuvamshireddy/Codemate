import React from 'react';

const Navbar = () => {
    const userName = localStorage.getItem('name')
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
          <div className="profile-icon">{userName[0]}</div>
          <span className="username">{userName}</span>
        </div>

        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
