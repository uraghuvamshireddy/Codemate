import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { acceptFriendRequest, deleteFriendRequest, getFriendLists, searchUser, sendFriendRequest, unfriend } from '../controllers/friendController.js';

const router = express.Router();
router.post('/send',verifyToken,sendFriendRequest);
router.post('/accept',verifyToken,acceptFriendRequest);
router.post('/delete',verifyToken,deleteFriendRequest);
router.post('/unfriend',verifyToken,unfriend)
router.get('/list',verifyToken,getFriendLists)
router.get('/search/:name',verifyToken,searchUser)

export default router;