import { pool } from "../database/db.js";
import redisClient from "../redis/redisClient.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
      
    const cachedprofile = await redisClient.get(`userProfile:${userId}`);
    if(cachedprofile){
      return res.json(JSON.parse(cachedprofile));
    }

    const result = await pool.query(
      `SELECT name, codeforces_link, leetcode_link, college_name, github_id, year_of_study, branch, degree
       FROM users
       WHERE id = $1`,
      [userId]
    );
    const profile=(result.rows[0]);
    await redisClient.set(`userProfile:${userId}`,JSON.stringify(profile));
    res.json(profile);

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};


export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    codeforces_link,
    leetcode_link,
    github_id,
    college_name,
    branch,
    degree,
    year_of_study
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
         name = $1,
         codeforces_link = $2,
         leetcode_link = $3,
         college_name = $4,
         github_id = $5,
         year_of_study = $6,
         branch = $7,
         degree = $8
       WHERE id = $9
       RETURNING *`,
      [
        name,
        codeforces_link,
        leetcode_link,
        college_name,
        github_id,
        year_of_study,
        branch,
        degree,
        userId
      ]
    );
    await redisClient.del(`userProfile:${userId}`);
    await redisClient.del(`codingProfile:${userId}`);
    res.json(result.rows[0]);
  } catch (error) {
    if(error.code === '23505'){
      return res.status(400).json({message:"This username already exists"});
    }
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getMe = async (req,res)=>{
  const userId = req.user.id;
  try{
   const result = await pool.query(
       'select id,name from users where id = $1',[userId] 
    )
    return res.json(result.rows[0]);
  }
  catch(err){
    res.status(500).json({ message: 'Error' });
  }
}
