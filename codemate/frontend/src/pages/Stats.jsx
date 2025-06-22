import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
  const [cf, setCf] = useState(null);
  const [lc, setLc] = useState(null);
  const token = localStorage.getItem('token');
  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;
    axios.get(`${backend}/profile/coding-data`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCf(res.data.codeforces);
      setLc(res.data.leetcode);
    })
    .catch(console.error);
  }, [token]);

  return (
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
  );
};

export default Stats;
