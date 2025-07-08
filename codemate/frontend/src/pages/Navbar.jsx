import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('name')
    const [query, setQuery] = useState('');
    const backend_URL = import.meta.env.VITE_BACKEND_URL;

const handleSearch = async (e) => {
    if (e.key === 'Enter' && query.trim()) {
    try {
      const { data: u } = await axios.get(`${backend_URL}/friends/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (u.isFriend) navigate(`/friend/${u.user.id}`);
      else navigate(`/user/${u.user.id}`);
    } catch (err) {
      navigate('/not-found');
    }
  }
};


    const handleProfileClick = () => {
      console.log('profile')
    navigate('/profile');
  };

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate('/');
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="company-name">CODEMATE</div>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="navbar-right">
        <button className="nav-button">Solutions</button>
        <button className="nav-button">Compare</button>

        <div className="profile">
          <div onClick={handleProfileClick} className="profile-icon"> {userName ? userName[0] : 'U'}</div>
          <span onClick={handleProfileClick} className="username"></span>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
