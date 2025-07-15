import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';
import OtherUserProfile from './pages/OtherUserProfile';
import FriendDashboard from './pages/FriendDashboard';
import Compare from './pages/Compare';
import Solutions from './pages/Solutions';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
       <Route path="/not-found" element={<NotFoundPage />} />
       <Route path="/user/:id" element={<OtherUserProfile />} />
        <Route path="/friend/:id" element={<FriendDashboard />} />  
        <Route path='/compare' element={<Compare />} /> 
        <Route path='/solutions' element={<Solutions />} />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
