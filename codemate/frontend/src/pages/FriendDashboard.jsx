import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

const FriendDashboard = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const backend = import.meta.env.VITE_BACKEND_URL;

  const [profile, setProfile] = useState(null);
  const [cf, setCf] = useState(null);
  const [lc, setLc] = useState(null);
  const [lists, setLists] = useState({ followers: [], following: [] });
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    axios.get(`${backend}/friendProfile/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProfile(res.data));

    axios.get(`${backend}/friendProfile/coding-data/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setCf(res.data.codeforces);
      setLc(res.data.leetcode);
    });

    axios.get(`${backend}/friendProfile/friendlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLists({
      followers: res.data.followers,
      following: res.data.following
    }));
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="profile-wrapper">
          <div className="profile-page">
            <div className="profile-summary">
              <h2 className="profile-heading">{profile.name}</h2>
              <div className="follow-stats">
                <button
                  className={`tab-button ${openPanel === 'followers' ? 'tab-active' : ''}`}
                  onClick={() => setOpenPanel(openPanel==='followers'?null:'followers')}
                >
                  Followers ({lists.followers.length})
                </button>
                <button
                  className={`tab-button ${openPanel === 'following' ? 'tab-active' : ''}`}
                  onClick={() => setOpenPanel(openPanel==='following'?null:'following')}
                >
                  Following ({lists.following.length})
                </button>
              </div>
            </div>

            {openPanel && (
              <div className="follow-list-panel-2col">
                <div className="follow-section">
                  <h3 className="side-heading">
                    {openPanel==='followers'?'Followers':'Following'}
                  </h3>
                  {(openPanel==='followers' ? lists.followers : lists.following).length === 0
                    ? <p className="no-contest">No users to show.</p>
                    : (openPanel==='followers' ? lists.followers : lists.following)
                        .map(u => (
                          <div key={u.name} className="follow-card">
                            <span>{u.name}</span>
                          </div>
                        ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>

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
            <p><strong>LeetCode:</strong> {profile.leetcode_link}</p>
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
                <h2>📅 Upcoming Contests</h2>
                {cf?.upcomingContests?.length
                  ? <ul className="contest-list">
                      {cf.upcomingContests.map(c => (
                        <li key={c.id}>
                          <span className="contest-name">{c.name}</span><br/>
                          <span className="contest-time">
                            {new Date(c.startTimeSeconds*1000).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  : <p className="no-contest">No upcoming contests</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendDashboard;
