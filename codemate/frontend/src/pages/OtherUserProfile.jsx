import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';

const OtherUserProfile = () => {
    const { id } = useParams();
  const [user, setUser] = useState(null);
  const [sent, setSent] = useState(false);
  const [lists,setLists] = useState({followers:[],following:[]});
  const token = localStorage.getItem('token');
  const backend_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${backend_URL}/friendProfile/user/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUser(r.data));
    axios.get(`${backend_URL}/friendProfile/friendlist/${id}`, { headers: { Authorization: `Bearer ${token}` } })
       .then(r=>setLists({followers:r.data.followers, following:r.data.following}));
    axios.get(`${backend_URL}/friendProfile/friend-request-status/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (res.data.status === 'pending' || res.data.status === 'accepted') {
      setSent(true);
    }
  });
  }, [id]);

  const sendRequest = () => {
    axios.post(`${backend_URL}/friends/send`, { toName: user.name }, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setSent(true))
      .catch((err) => {
      console.error("Failed to send request", err);
    });
  };

  if (!user) return <div>Loading...</div>;
  return (
     <div className="otheruser-wrapper">
        <Navbar />
      <h2>{user.name}</h2>
      <div className="otheruser-followers-wrapper">
        <strong>Followers : {lists.followers.length}</strong>
        <strong>Following : {lists.following.length}</strong>
      </div>
      <button className="friend-request-btn" disabled={sent} onClick={sendRequest}>
      {sent ? 'Request Sent ✅' : 'Send Friend Request'}
      </button>

    </div>
  )
}

export default OtherUserProfile
