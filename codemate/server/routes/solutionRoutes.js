import express from 'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { getSolutionVideos } from '../controllers/solutionsController.js';

const router = express.Router();

router.get('/solution',verifyToken,getSolutionVideos)

export default router;