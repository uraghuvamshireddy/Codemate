import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Compare = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const [metric, setMetric] = useState('cf');
  const [loading, setLoading] = useState(true);
  const [compareData, setCompareData] = useState([]);

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        const meRes = await axios.get(`${backend}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const myData = meRes.data;

        const listRes = await axios.get(`${backend}/friends/list`,{
          headers: { Authorization: `Bearer ${token}` }
        });
        const following = listRes.data.following.map(f => f.name);
        const allFollowing = [...following,myData.name]
        const usersWithScores = [];
       for (const name of allFollowing) {
  const userRes = await axios.get(
    `${backend}/friends/search/${name}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const { id } = userRes.data.user;

  const codingRes = await axios.get(
    `${backend}/friendProfile/coding-data/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  usersWithScores.push({
    name,
    cfRating: codingRes.data.codeforces.rating || 0,
    cfSolved: codingRes.data.codeforces.solvedCount,
    lcRank: codingRes.data.leetcode.ranking,
    lcSolved: codingRes.data.leetcode.totalSolved,
  });
}


        setCompareData(usersWithScores);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching compare data:', err);
      }
    };

    fetchCompareData();
  }, []);

  const sortedData = [...compareData].sort((a, b) => {
    if (metric === 'cf') return b.cfRating - a.cfRating;
    else return a.lcRank - b.lcRank;
  });

  return (
   <div className="compare-container">
  <Navbar />
  <div className="compare-wrapper">
    <h2 className="compare-heading">The Ultimate Battle</h2>

    <div className="metric-toggle">
      <button
        className={metric === 'cf' ? 'active' : ''}
        onClick={() => setMetric('cf')}
      >
        Codeforces
      </button>
      <button
        className={metric === 'lc' ? 'active' : ''}
        onClick={() => setMetric('lc')}
      >
        LeetCode
      </button>
    </div>

    {loading ? (
      <p>Loading...</p>
    ) : (
      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>{metric === 'cf' ? 'CF Rating' : 'LC Rank'}</th>
              <th>Solved</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{metric === 'cf' ? user.cfRating : user.lcRank}</td>
                <td>{metric === 'cf' ? user.cfSolved : user.lcSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

)};

export default Compare;
