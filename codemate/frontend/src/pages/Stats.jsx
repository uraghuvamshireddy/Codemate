import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Heatmap({ data = [], colorFn }) {
  const totalCols = 10;
  const filled  = data.length;
  const blanks  = (totalCols - (filled % totalCols)) % totalCols;

  return (
    <div className="heatmap-grid">
      {data.map(({ date, count }) => (
        <div
          key={date}
          className="heatmap-cell"
          title={`${date}: ${count}`}
          style={{ backgroundColor: colorFn(count) }}
        />
      ))}
      {Array.from({ length: blanks }).map((_, i) => (
        <div key={`empty-${i}`} className="heatmap-cell empty" />
      ))}
    </div>
  );
}

const Stats = () => {
  const [cf, setCf] = useState(null);
  const [lc, setLc] = useState(null);
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem('token');
  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data: coding } = await axios.get(`${backend}/profile/coding-data`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCf(coding.codeforces);
        setLc(coding.leetcode);
      } catch (err) {
        console.error(err);
      }
      try {
        const { data: prof } = await axios.get(`${backend}/profile/userProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(prof);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const cfColor = c => c === 0 ? '#334155' : c < 3 ? '#4ade80' : '#16a34a';
  const lcColor = c => c === 0 ? '#334155' : c < 3 ? '#60a5fa' : '#3b82f6';

  if (!cf || !lc) return <p>Loading stats…</p>;

  return (
    <div className="stats-page">
      <div className="profile-side">
        <h2 className="side-heading">👤 Profile Info</h2>
        <div className="profile-bg">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>College:</strong> {profile.college_name}</p>
          <p><strong>Degree:</strong> {profile.degree}</p>
          <p><strong>Branch:</strong> {profile.branch}</p>
          <p><strong>Year:</strong> {profile.year_of_study}</p>
          <p><strong>GitHub:</strong> {profile.github_id}</p>
          <p><strong>Codeforces:</strong> {profile.codeforces_link}</p>
          <p><strong>LeetCode:</strong> {profile.leetcode_link}</p>
        </div>
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
        </div>        </div>

        <div className="stats-row">
          <div className="stat-card contest-card">
            <h2>📅 Upcoming Codeforces Contests</h2>
            {cf.upcomingContests.length
              ? <ul className="contest-list">
                  {cf.upcomingContests.map(c => (
                    <li key={c.id}>
                      <span className="contest-name">{c.name}</span><br/>
                      <span className="contest-time">
                        {new Date(c.startTimeSeconds * 1000).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              : <p className="no-contest">No upcoming contests</p>
            }
          </div>
        </div>

        <div className="stats-row heatmaps-wrapper">
          <div className="stat-card heatmap-card">
            <h2>🔥 CF Last 30d</h2>
            <Heatmap data={cf.heatmap} colorFn={cfColor} />
          </div>
          <div className="stat-card heatmap-card">
            <h2>❄️ LC Last 30d</h2>
            <Heatmap data={lc.heatmap} colorFn={lcColor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
