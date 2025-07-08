import { pool } from "../database/db.js";
import axios from 'axios'


export const getUserbyId = async(req,res)=>{
    const {id} = req.params;
    try{
        const u = await pool.query (
            'SELECT name, codeforces_link, leetcode_link, college_name, github_id, year_of_study, branch, degree FROM users WHERE id=$1',
            [id]
        );
        if(!u.rowCount)return res.status(404).json({message:"User not found"});
        res.json(u.rows[0]);
    }catch(err){
        res.status(500).json({message:"Error"});
    }
};

export const getCodingDatabyId = async(req,res)=>{
    const {id} = req.params;
    try{
        const result = await pool.query(
            'SELECT codeforces_link, leetcode_link FROM users WHERE id = $1', [id]
        );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const codeforcesHandle = result.rows[0].codeforces_link;
    const leetcodeUsername = result.rows[0].leetcode_link;

    const [cfUser, cfSubs, cfContests] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${codeforcesHandle}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${codeforcesHandle}`),
      axios.get(`https://codeforces.com/api/contest.list`)
    ]);

    const solvedSet = new Set();
    cfSubs.data.result.forEach(sub => {
      if (sub.verdict === "OK") {
        solvedSet.add(sub.problem.name);
      }
    });

    const upcomingContests = cfContests.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .slice(0, 5);

    const leetcodeRes = await axios.get(`https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`);
    const lcData = leetcodeRes.data;
    return res.json({
      codeforces: {
        rating: cfUser.data.result[0].rating || 'Unrated',
        solvedCount: solvedSet.size,
        upcomingContests
      },
      leetcode: {
        totalSolved: lcData.totalSolved,
        easySolved: lcData.easySolved,
        mediumSolved: lcData.mediumSolved,
        hardSolved: lcData.hardSolved,
        ranking: lcData.ranking
      }
    });


    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user coding data' });
    }
} 

export const getFriendListsById = async (req, res) => {
  const targetId = parseInt(req.params.id, 10);

  try {
    const followers = await pool.query(`
      SELECT u.name 
      FROM friendships
      JOIN users u ON u.id = friendships.requester_id
      WHERE friendships.addressee_id = $1
        AND friendships.status = 'accepted'
    `, [targetId]);

    const following = await pool.query(`
      SELECT u.name 
      FROM friendships
      JOIN users u ON u.id = friendships.addressee_id
      WHERE friendships.requester_id = $1
        AND friendships.status = 'accepted'
    `, [targetId]);

    res.json({
      followers: followers.rows,
      following: following.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch friend data" });
  }
};

export const checkFriendRequestStatus = async (req, res) => {
  const currentUserId = req.user.id; 
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT status FROM friendships
       WHERE requester_id = $1 AND addressee_id = $2`,
      [currentUserId, id]
    );

    if (result.rowCount === 0) {
      return res.json({ status: "none" });
    }

    return res.json({ status: result.rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking friend request status" });
  }
};



