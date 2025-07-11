import express from 'express';
import { getMe, getUserProfile,updateProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router()

router.get('/userProfile',verifyToken,getUserProfile)
router.put('/updateProfile',verifyToken,updateProfile);
router.get('/me',verifyToken,getMe)

export default router;