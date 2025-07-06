import express from 'express'
import { verifyToken } from '../middleware/authMiddleware';
import { acceptFriendRequest, deleteFriendRequest, getFriendLists, searchUser, sendFriendRequest } from '../controllers/friendController';

const router = express.Router();
router.post('/send',verifyToken,sendFriendRequest);
router.post('/accept',verifyToken,acceptFriendRequest);
router.post('/delete',verifyToken,deleteFriendRequest);
router.get('/list',verifyToken,getFriendLists)
router.get('/search/:username',verifyToken,searchUser)

export default router;