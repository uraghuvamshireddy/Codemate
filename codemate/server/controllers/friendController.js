import { pool } from "../database/db.js";

export const sendFriendRequest = async (req, res) => {
  const requesterId = req.user.id;
  const { toName } = req.body;
  try {
    const targetRes = await pool.query(
      "SELECT id FROM users WHERE name = $1",
      [toName]
    );
    if (targetRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const addresseeId = targetRes.rows[0].id;
    if (requesterId === addresseeId) {
      return res.status(400).json({ message: "You can't friend yourself" });
    }
    await pool.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending')
       ON CONFLICT DO NOTHING`,
      [requesterId, addresseeId]
    );
    res.status(200).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const addresseeId = req.user.id;
  const { fromName } = req.body;
  try {
    const requesterRes = await pool.query(
      "SELECT id FROM users WHERE name = $1",
      [fromName]
    );
    if (requesterRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const requesterId = requesterRes.rows[0].id;
    const result = await pool.query(
      `UPDATE friendships SET status = 'accepted'
       WHERE requester_id = $1 AND addressee_id = $2`,
      [requesterId, addresseeId]
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
  const currentId = req.user.id;
  const { otherName } = req.body;
  try {
    const otherRes = await pool.query(
      "SELECT id FROM users WHERE name = $1",
      [otherName]
    );
    if (otherRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const otherId = otherRes.rows[0].id;
    await pool.query(
      `DELETE FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)`,
      [currentId, otherId]
    );
    res.json({ message: "Request or friendship deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting request" });
  }
};

export const unfriend = async (req, res) => {
  try {
    const currentId = req.user.id;
    const { targetName } = req.body;
    const targetRes = await pool.query(
      "SELECT id FROM users WHERE name = $1",
      [targetName]
    );
    if (targetRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const targetId = targetRes.rows[0].id;
    const deleteRes = await pool.query(
      `DELETE FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)
       RETURNING *`,
      [currentId, targetId]
    );
    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ message: "Friendship not found" });
    }
    res.json({ message: "Unfriended successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendLists = async (req, res) => {
  const currentId = req.user.id;
  try {
    const followers = await pool.query(
      `SELECT u.name FROM friendships
       JOIN users u ON u.id = friendships.requester_id
       WHERE friendships.addressee_id = $1
         AND friendships.status = 'accepted'`,
      [currentId]
    );
    const following = await pool.query(
      `SELECT u.name FROM friendships
       JOIN users u ON u.id = friendships.addressee_id
       WHERE friendships.requester_id = $1
         AND friendships.status = 'accepted'`,
      [currentId]
    );
    const pendingReceived = await pool.query(
      `SELECT u.name FROM friendships
       JOIN users u ON u.id = friendships.requester_id
       WHERE friendships.addressee_id = $1
         AND friendships.status = 'pending'`,
      [currentId]
    );
    const pendingSent = await pool.query(
      `SELECT u.name FROM friendships
       JOIN users u ON u.id = friendships.addressee_id
       WHERE friendships.requester_id = $1
         AND friendships.status = 'pending'`,
      [currentId]
    );
    res.json({
      followers: followers.rows,
      following: following.rows,
      pendingReceived: pendingReceived.rows,
      pendingSent: pendingSent.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't fetch friend data" });
  }
};

export const searchUser = async (req, res) => {
  const { name: targetName } = req.params;
  const currentId = req.user.id;
  try {
    const userRes = await pool.query(
      "SELECT id, name FROM users WHERE name = $1",
      [targetName]
    );
    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const targetUser = userRes.rows[0];
    if (targetUser.id === currentId) {
      return res.json({ user: targetUser, isFriend: true });
    }
    const friendshipRes = await pool.query(
      `SELECT * FROM friendships
       WHERE status = 'accepted' AND (
         (requester_id = $1 AND addressee_id = $2)
         OR (requester_id = $2 AND addressee_id = $1)
       )`,
      [currentId, targetUser.id]
    );
    res.json({ user: targetUser, isFriend: friendshipRes.rowCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
