import express from 'express';
import passport from 'passport';
import { authSuccess } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authSuccess
);


export default router;
