import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const username = query.get('name');

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('name',username)
      setName(username);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Dashboard;
