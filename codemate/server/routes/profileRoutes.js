import express from 'express';
import { getUserProfile,updateProfile } from '../controllers/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router()

router.get('/userProfile',verifyToken,getUserProfile)
router.put('/updateProfile',verifyToken,updateProfile);

export default router;