import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    codeforces_link: '',
    leetcode_link: '',
    github_id: '',
    college_name: '',
    degree: '',
    branch: '',
    year_of_study: '',
  });
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
      <div className="user-profile">

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
              <input
                className="profile-input"
                placeholder="GitHub ID"
                value={profile.github_id}
                onChange={(e) => setProfile({ ...profile, github_id: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="College Name"
                value={profile.college_name}
                onChange={(e) => setProfile({ ...profile, college_name: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="Degree"
                value={profile.degree}
                onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="Branch"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
              />
              <input
                className="profile-input"
                placeholder="Year of Study"
                value={profile.year_of_study}
                onChange={(e) => setProfile({ ...profile, year_of_study: e.target.value })}
              />
              
              <button className="profile-save-btn" onClick={updateProfile}>Save</button>
            </div>
          ) : (
            <div className="profile-details">
              <p><strong>Name:</strong> {profile.name || localStorage.getItem('name') || 'Not provided'}</p>
              <p><strong>Codeforces:</strong> {profile.codeforces_link || 'Not linked'}</p>
              <p><strong>LeetCode:</strong> {profile.leetcode_link || 'Not linked'}</p>
              <p><strong>GitHub:</strong> {profile.github_id || 'Not linked'}</p>
              <p><strong>College:</strong> {profile.college_name || 'Not provided'}</p>
              <p><strong>Degree:</strong> {profile.degree || 'Not provided'}</p>
              <p><strong>Branch:</strong> {profile.branch || 'Not provided'}</p>
              <p><strong>Year of Study:</strong> {profile.year_of_study || 'Not provided'}</p>

              <button className="profile-edit-btn" onClick={() => setEdit(true)}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;



