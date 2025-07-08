import { pool } from "../database/db.js";

export const sendFriendRequest = async (req, res) => {
  const requesterName = req.user.name;
  const { toName } = req.body;
  if (requesterName === toName) {
    return res.status(400).json({ message: "You can't friend yourself" });
  }

  try {
    await pool.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES (
         (SELECT id FROM users WHERE name = $1),
         (SELECT id FROM users WHERE name = $2),
         'pending'
       )
       ON CONFLICT DO NOTHING`,
      [requesterName, toName]
    );

    return res.status(200).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const toName = req.user.name;
  const { fromName } = req.body;

  try {
    const result = await pool.query(
      `UPDATE friendships SET status = 'accepted'
       WHERE requester_id = (SELECT id FROM users WHERE name = $1)
       AND addressee_id = (SELECT id FROM users WHERE name = $2)`,
      [fromName, toName]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error accepting request" });
  }
};

export const deleteFriendRequest = async (req, res) => {
  const currentName = req.user.name;
  const { otherName } = req.body;

  try {
    await pool.query(
      `DELETE FROM friendships
       WHERE (
         requester_id = (SELECT id FROM users WHERE name = $1)
         AND addressee_id = (SELECT id FROM users WHERE name = $2)
       ) OR (
         requester_id = (SELECT id FROM users WHERE name = $2)
         AND addressee_id = (SELECT id FROM users WHERE name = $1)
       )`,
      [currentName, otherName]
    );

    res.json({ message: "Request or friendship deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting request" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const requestId = req.user.id;
    const { targetName } = req.body;

    if (!requestId || !targetName) {
      return res.status(400).json({ message: 'Missing requestId or targetName' });
    }

    const targetRes = await pool.query(
      'SELECT id FROM users WHERE name = $1',
      [targetName]
    );

    if (targetRes.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const targetId = targetRes.rows[0].id;

    const deleteRes = await pool.query(
      `DELETE FROM friendships 
       WHERE (requester_id = $1 AND addressee_id = $2) 
          OR (requester_id = $2 AND addressee_id = $1) 
       RETURNING *`,
      [requestId, targetId]
    );

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    return res.status(200).json({ message: 'Unfriended successfully' });
  } catch (err) {
    console.error('Unfriend error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFriendLists = async (req, res) => {
  const name = req.user.name;

  try {
    const followers = await pool.query(`
      SELECT u.name FROM friendships
      JOIN users u ON u.id = friendships.requester_id
      WHERE friendships.addressee_id = (SELECT id FROM users WHERE name = $1)
      AND friendships.status = 'accepted'
    `, [name]);

    const following = await pool.query(`
      SELECT u.name FROM friendships
      JOIN users u ON u.id = friendships.addressee_id
      WHERE friendships.requester_id = (SELECT id FROM users WHERE name = $1)
      AND friendships.status = 'accepted'
    `, [name]);

    const pendingReceived = await pool.query(`
      SELECT u.name FROM friendships
      JOIN users u ON u.id = friendships.requester_id
      WHERE friendships.addressee_id = (SELECT id FROM users WHERE name = $1)
      AND friendships.status = 'pending'
    `, [name]);

    const pendingSent = await pool.query(`
      SELECT u.name FROM friendships
      JOIN users u ON u.id = friendships.addressee_id
      WHERE friendships.requester_id = (SELECT id FROM users WHERE name = $1)
      AND friendships.status = 'pending'
    `, [name]);

    res.json({
      followers: followers.rows,
      following: following.rows,
      pendingReceived: pendingReceived.rows,
      pendingSent: pendingSent.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch friend data" });
  }
};

export const searchUser = async (req, res) => {
  const { name: targetName } = req.params;
  const currentName = req.user.name;

  if (!targetName || typeof targetName !== 'string') {
    return res.status(400).json({ message: "Invalid name" });
  }
  

  try {
    const userResult = await pool.query(
      `SELECT id, name FROM users WHERE name = $1`,
      [targetName]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUser = userResult.rows[0];
    if(targetName == currentName){
     return res.status(200).json({ user: targetUser, isFriend:true });
    }

    const friendshipResult = await pool.query(`
      SELECT * FROM friendships WHERE (
        requester_id = (SELECT id FROM users WHERE name = $1)
        AND addressee_id = (SELECT id FROM users WHERE name = $2)
    )
      AND status = 'accepted'
    `, [currentName, targetName]);
     
    const isFriend = friendshipResult.rowCount > 0;
    
    return res.status(200).json({ user: targetUser, isFriend });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
