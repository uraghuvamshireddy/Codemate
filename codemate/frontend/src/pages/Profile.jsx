import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
const [profile, setProfile] = useState({name:'', codeforces_link:'', leetcode_link:''});
  const [edit, setEdit] = useState(false);

  const backend_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backend_URL}/profile/userProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Profile:', res.data);
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${backend_URL}/profile/updateProfile`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Updated Profile:', res.data);
      setProfile(res.data);
      setEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
   <div>
    <Navbar />
     <div className="profile-wrapper">
      
      <div className="profile-page">
        <h2 className="profile-heading">Your Profile</h2>
        {edit ? (
          <div className="profile-edit">
            <input
              className="profile-input"
              placeholder="Name"
              value={profile.name ?? ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              className="profile-input"
              placeholder="Codeforces Link"
              value={profile.codeforces_link || ''}
              onChange={(e) => setProfile({ ...profile, codeforces_link: e.target.value })}
            />
            <input
              className="profile-input"
              placeholder="LeetCode Link"
              value={profile.leetcode_link || ''}
              onChange={(e) => setProfile({ ...profile, leetcode_link: e.target.value })}
            />
            <button className="profile-save-btn" onClick={updateProfile}>Save</button>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Name:</strong> {profile.name || localStorage.getItem('name') || 'Not provided'}</p>
            <p><strong>Codeforces:</strong> {profile.codeforces_link || 'Not linked'}</p>
            <p><strong>LeetCode:</strong> {profile.leetcode_link || 'Not linked'}</p>
            <button className="profile-edit-btn" onClick={() => setEdit(true)}>Edit</button>
          </div>
        )}
      </div>
    </div>
   </div>
  );
};

export default Profile;
