import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
  const [cf, setCf] = useState(null);
  const [lc, setLc] = useState(null);
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
  const token = localStorage.getItem('token');
  const backend = import.meta.env.VITE_BACKEND_URL;

useEffect(() => {
  if (!token) return;

  const fetchData = async () => {
    try {
      const codingRes = await axios.get(`${backend}/profile/coding-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCf(codingRes.data.codeforces);
      setLc(codingRes.data.leetcode);
    } catch (err) {
      console.error('Error fetching coding data:', err);
    }

    try {
      const res = await axios.get(`${backend}/profile/userProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched Profile:', res.data);
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  fetchData();
}, [token]);


  return (
    <div className="stats-page">
      <div className="profile-side">
      <h2 className="side-heading">👤 Profile Info</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>College:</strong> {profile.college_name}</p>
      <p><strong>Degree:</strong> {profile.degree}</p>
      <p><strong>Branch:</strong> {profile.branch}</p>
      <p><strong>Year:</strong> {profile.year_of_study}</p>
      <p><strong>GitHub:</strong> {profile.github_id}</p>
      <p><strong>Codeforces:</strong> {profile.codeforces_link}</p>
      <p><strong>LeetCode:</strong>{profile.leetcode_link}</p>
    </div>
    <div className="stats-container">
      <div className="stats-row">
        <div className="stat-card">
          <h2>🔢 Solved Problems</h2>
          <div className="stat-item">
            <strong>Codeforces:</strong> {cf?.solvedCount ?? 0}
          </div>
          <div className="stat-item">
            <strong>LeetCode:</strong> {lc?.totalSolved ?? 0}
            <div className="lc-difficulty">
              <span className="easy">🟢 {lc?.easySolved ?? 0}</span>
              <span className="medium">🟡 {lc?.mediumSolved ?? 0}</span>
              <span className="hard">🔴 {lc?.hardSolved ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h2>📊 Ratings</h2>
          <div className="stat-item">
            <strong>Codeforces:</strong> {cf?.rating ?? 'N/A'}
          </div>
          <div className="stat-item">
            <strong>LeetCode Rank:</strong> {lc?.ranking ?? 'N/A'}
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card contest-card">
          <h2>📅 Upcoming Codeforces Contests</h2>
          {cf?.upcomingContests?.length ? (
            <ul className="contest-list">
              {cf.upcomingContests.map(contest => (
                <li key={contest.id}>
                  <span className="contest-name">{contest.name}</span><br />
                  <span className="contest-time">{new Date(contest.startTimeSeconds * 1000).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : <p className="no-contest">No upcoming contests</p>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Stats;
