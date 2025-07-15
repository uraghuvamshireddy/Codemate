import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import './middleware/passport.js';
import authRoutes from './routes/authRoutes.js';
import { pool } from './database/db.js';
import profileRoutes from './routes/profileRoutes.js'
import userDataRoutes from './routes/userDataRoute.js'
import friendRoutes from './routes/friendRoutes.js'
import friendDataRoutes from './routes/friendDataRoutes.js'
import solutionRoutes from './routes/solutionRoutes.js'

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/profile',profileRoutes)
app.use('/profile',userDataRoutes)
app.use('/friends',friendRoutes)
app.use('/friendProfile',friendDataRoutes)
app.use('/contest',solutionRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB error:', err);
  } else {
    console.log('DB connected:', res.rows[0]);
  }
});
