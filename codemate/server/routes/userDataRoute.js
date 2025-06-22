import express from 'express';
import { getUserCodingData } from '../controllers/userDataController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/coding-data', verifyToken, getUserCodingData);

export default router;
