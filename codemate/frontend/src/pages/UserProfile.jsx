import React, { useEffect, useState } from 'react';
import axios from 'axios';

const backend_URL = import.meta.env.VITE_BACKEND_URL;

const UserProfile = () => {
  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  const [followers, setFollowers] = useState([]);
  const [followRequests, setFollowRequests] = useState([]);
  const [following, setFollowing] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [openPanel, setOpenPanel] = useState(null); // 'followers' | 'following' | null

  useEffect(() => {
    fetchFollowData();
  }, []);

  const fetchFollowData = async () => {
    try {
      const res = await axios.get(`${backend_URL}/friends/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res);
      setFollowers(res.data.followers);
      setFollowing(res.data.following);
      setFollowRequests(res.data.pendingReceived || []);
      setSentRequests(res.data.pendingSent || []);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const acceptRequest = async (fromName) => {
  try {
    const res = await axios.post(
      `${backend_URL}/friends/accept`,
      { fromName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message);
    fetchFollowData(); 
  } catch (err) {
    console.error(err);
    alert("Error accepting request");
  }
};

const rejectRequest = async (otherName) => {
  try {
    const res = await axios.post(
      `${backend_URL}/friends/delete`,
      { otherName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message);
    fetchFollowData(); 
  } catch (err) {
    console.error(err);
    alert("Error rejecting request");
  }
};

const cancelRequest = async (otherName) => {
  try {
    const res = await axios.post(
      `${backend_URL}/friends/delete`,
      { otherName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message);
    fetchFollowData(); 
  } catch (err) {
    console.error(err);
    alert("Error cancelling request");
  }
};

const unfriend = async (targetName) => {
  try {
    const res = await axios.post(
      `${backend_URL}/friends/unfriend`,
      { targetName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert(res.data.message);
    fetchFollowData();
  } catch (err) {
    console.error(err);
    alert("Error unfriending");
  }
};



  return (
    <div className="profile-wrapper">
      <div className="profile-page">
        <div className="profile-summary">
          <h2 className="profile-heading">{name}</h2>
          <div className="follow-stats">
            <button className={`tab-button ${openPanel === 'followers' ? 'tab-active' : ''}`} onClick={() => togglePanel('followers')}>
              Followers ({followers.length})
            </button>
            <button className={`tab-button ${openPanel === 'following' ? 'tab-active' : ''}`} onClick={() => togglePanel('following')}>
              Following ({following.length})
            </button>
          </div>
        </div>

        {openPanel && (
          <div className="follow-list-panel-2col">
            <div className="follow-section">
              {(openPanel === 'followers' ? followers : following).length === 0 ? (
                <p className="no-contest">No {openPanel} to show.</p>
              ) : (
                (openPanel === 'followers' ? followers : following).map((u) => (
                  <div key={u.name} className="follow-card">
                    <span>{u.name}</span>
                    <button className="action-btn" onClick={() => unfriend(u.name)}>Unfriend</button>
                  </div>
                ))
              )}
            </div>

            <div className="follow-section">
              {(openPanel === 'followers' ? followRequests : sentRequests).length === 0 ? (
                <p className="no-contest">{openPanel === 'followers' ? 'No requests' : 'No sent requests'}</p>
              ) : (
                (openPanel === 'followers' ? followRequests : sentRequests).map((u) => (
                  <div key={u.name} className="follow-card">
                    <span>{u.name}</span>
                    {openPanel === 'followers' ? (
                      <>
                        <button className="action-btn accept" onClick={() => acceptRequest(u.name)}>Accept</button>
                        <button className="action-btn decline" onClick={() => rejectRequest(u.name)}>Decline</button>
                      </>
                    ) : (
                      <button className="action-btn cancel" onClick={() => cancelRequest(u.name)}>Cancel</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
