import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar';

const Solutions = () => {
 const [videos,setVideos] = useState([]);
 const [platform,setPlatform] = useState('all');
 const token = localStorage.getItem('token');
const backend_URL = import.meta.env.VITE_BACKEND_URL;


 useEffect(()=>{
  const fetchVideos = async()=>{
    try{
      const res = await axios.get(`${backend_URL}/contest/solution`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setVideos(res.data.videos);
    }catch(error){
      console.log('Error fetching videos',error);
    }
  };
  fetchVideos();
 },[]);

 const filteredVideos = 
 platform == 'all'
  ? videos
  : videos.filter(video=>video.platform == platform)
   

 return (
    <div className="solutions-container">
      <Navbar />
      <div className="solutions-header">
        <h2>Latest Solution Videos</h2>
        <select
          className="platform-select"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        >
          <option value="all">All</option>
          <option value="leetcode">LeetCode</option>
          <option value="codeforces">Codeforces</option>
        </select>
      </div>

      <div className="videos-grid">
        {filteredVideos.map(video => (
          <div className="video-card" key={video.id}>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
              />
              <div className="video-info">
                <p className="video-title">{video.title}</p>
                <p className="video-date">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Solutions
