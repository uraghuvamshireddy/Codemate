import {pool} from "../database/db.js";

export const sendFriendRequest = async(req,res)=>{
    const requester = req.user.id
    const {addresseeId} = req.body;

    if(requester == addresseeId){
        return res.status(400).json({message:"You can't friend yourself"});
    }
    try{
        await pool.query(
            `insert into friendships (requester_id,addressee_id,status)
            values ($1, $2, 'pending) on conflict do nothing`,
            [requester,addresseeId]
        );
        return res.status(200).json({message:"Request send successfully"});
        
    }catch(err){
        res.status(500).json({message:"Error sending request"});
    }


};


export const acceptFriendRequest = async (req,res)=>{
    const userId = req.user.id;
    const {requesterId} = req.body;

    try{
        await pool.query(
            `update friendships set status ='accepted'
            where requester_id = $1 and addressee_id = $2`,
            [requesterId,userId]
        );
        res.json({message:"Friend Request Accepted"});
    }catch(err){
        return res.status(500).json({message:'Error accepting request'});
    }
};

export const deleteFriendRequest = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.body;

  try {
    await pool.query(
      `DELETE FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)`,
      [userId, otherUserId]
    );
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting request' });
  }
};


export const getFriendLists = async (req, res) => {
  const userId = req.user.id;

  try {
    const followers = await pool.query(`
      SELECT users.id, users.name FROM friendships
      JOIN users ON users.id = friendships.requester_id
      WHERE friendships.addressee_id = $1 AND friendships.status = 'accepted'
    `, [userId]);

    const following = await pool.query(`
      SELECT users.id, users.name FROM friendships
      JOIN users ON users.id = friendships.addressee_id
      WHERE friendships.requester_id = $1 AND friendships.status = 'accepted'
    `, [userId]);

    const pendingReceived = await pool.query(`
      SELECT users.id, users.name FROM friendships
      JOIN users ON users.id = friendships.requester_id
      WHERE friendships.addressee_id = $1 AND friendships.status = 'pending'
    `, [userId]);

    const pendingSent = await pool.query(`
      SELECT users.id, users.name FROM friendships
      JOIN users ON users.id = friendships.addressee_id
      WHERE friendships.requester_id = $1 AND friendships.status = 'pending'
    `, [userId]);

    res.json({
      followers: followers.rows,
      following: following.rows,
      pendingSent: pendingSent.rows,
      pendingReceived: pendingReceived.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch friend data" });
  }
};

export const searchUser = async(req,res)=>{
  const {username} = req.params;
  const currentUserId = req.user.id;
  if (!username || typeof username !== 'string') {
  return res.status(400).json({message: "Invalid username"});
}

  try{
    const userResult = await pool.query(
      'SELECT id, username, name FROM users WHERE username = $1',
      [username]
    );
    if(userResult.rowCount===0){
      return res.status(404).json({message:"User not found"});

    }
    const targetUser = userResult.rows[0];
    const friendshipResult = await pool.query(`
      select * from friendships where(
      (requester_id = $1 and addressee_id = $2) or
      (requester_id = $2 and addressee_id = $1)
      ) and status = 'accepted'
      `,[currentUserId,targetUser.id]);

      const isFriend = friendshipResult.rowCount>0;
      return res.status(200).json({user:targetUser,isFriend});
  }catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal Server error"});
  }
};