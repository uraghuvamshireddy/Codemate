import { pool } from "../database/db.js";

export const getUserProfile = async(req,res)=>{
    const userId = req.user.id;
    try{
        const result = await pool.query('SELECT name,codeforces_link,leetcode_link FROM users WHERE id = $1',[userId]);
        res.json(result.rows[0]);
    }catch(error){
        res.status(500).json({message:"Error fetching profile"});
    }
};

export const updateProfile = async(req,res)=>{
    const userId = req.user.id;
    const {name,codeforces_link,leetcode_link}=req.body;

    console.log("Update request by user:", userId);
    console.log("Update data:", { name, codeforces_link, leetcode_link });

    try{
        const result = await pool.query(
            'UPDATE users SET name =$1 ,codeforces_link=$2,leetcode_link=$3 WHERE id = $4 RETURNING *',
         [name,codeforces_link,leetcode_link,userId]   
        );
        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({message:'Error updating profile'});
    }
}