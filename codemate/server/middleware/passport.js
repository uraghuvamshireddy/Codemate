import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { pool } from '../database/db.js';
import jwt from 'jsonwebtoken';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;

  try {
    let user;
    const result = await pool.query(
      'SELECT id, name, email, google_id, codeforces_link, leetcode_link FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email, google_id, codeforces_link, leetcode_link',
        [profile.displayName, email, profile.id]
      );
      user = newUser.rows[0];
    }

    done(null, user); 
  } catch (error) {
    console.error('Error in Google Strategy:', error);
    done(error, null);
  }
}));
