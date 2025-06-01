import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const username = query.get('name');

    if (token) {
      localStorage.setItem('token', token);
      setName(username);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Hello, {name}</h2>
      <p>Welcome to your Dashboard</p>
    </div>
  );
};

export default Dashboard;
