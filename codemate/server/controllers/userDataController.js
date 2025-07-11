import axios from 'axios'
import { pool } from '../database/db.js'

export const getUserCodingData = async (req,res)=>{
    const userId = req.user.id;
    try{
        const result = await pool.query(
            'SELECT codeforces_link, leetcode_link FROM users WHERE id = $1', [userId]
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

    const today = new Date();
    const cfbyDay = {},lcbyDay = {};
    for(let i=29;i>=0;i--){
      const d = new Date(today);
      d.setDate(d.getDate()-i);
      const key = d.toISOString().slice(0,10);
      cfbyDay[key]=0
      lcbyDay[key]=0
    }

    cfSubs.data.result.forEach(sub=>{
      if(sub.verdict != 'OK')return
      const day = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0,10)
      if(cfbyDay[day] != undefined)cfbyDay[day]++;
    })

    const lcCal = lcData.submissionCalendar || {}
    Object.entries(lcCal).forEach(([unix, count]) => {
      const day = new Date(parseInt(unix,10)*1000)
                    .toISOString().slice(0,10)
      if (lcbyDay[day] !== undefined) lcbyDay[day] = count
    })

    const cfHeat = Object.entries(cfbyDay).map(([date,count])=>({date,count}));
    const lcHeat = Object.entries(lcbyDay).map(([date,count])=>({date,count}));

    return res.json({
      codeforces: {
        rating: cfUser.data.result[0].rating || 'Unrated',
        solvedCount: solvedSet.size,
        upcomingContests,
        heatmap:cfHeat
      },
      leetcode: {
        totalSolved: lcData.totalSolved,
        easySolved: lcData.easySolved,
        mediumSolved: lcData.mediumSolved,
        hardSolved: lcData.hardSolved,
        ranking: lcData.ranking,
        heatmap: lcHeat
      }
    });


    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user coding data' });
    }
}