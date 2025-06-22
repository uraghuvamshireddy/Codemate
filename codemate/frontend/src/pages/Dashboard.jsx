import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Stats from './Stats';

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const urlToken = query.get('token');
    const username = query.get('name');

    if (urlToken && username) {
      localStorage.setItem('token', urlToken);
      localStorage.setItem('name', username);
      setToken(urlToken);
      setName(username);
    } else {
      const storedToken = localStorage.getItem('token');
      const storedName = localStorage.getItem('name');

      if (!storedToken || !storedName) {
        navigate('/');
      } else {
        setToken(storedToken);
        setName(storedName);
      }
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      {token && <Stats />}
    </div>
  );
};

export default Dashboard;
