import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkFriendRequestStatus, getCodingDatabyId, getFriendListsById, getUserbyId } from '../controllers/friendDatacontroller.js';

const router = express.Router();

router.get('/user/:id',verifyToken,getUserbyId);
router.get('/coding-data/:id',verifyToken,getCodingDatabyId);
router.get('/friendlist/:id',verifyToken,getFriendListsById);
router.get('/friend-request-status/:id', verifyToken, checkFriendRequestStatus);


export default router