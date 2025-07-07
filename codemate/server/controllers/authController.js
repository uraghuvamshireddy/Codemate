import jwt from 'jsonwebtoken';

export const authSuccess = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user.id,name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const frontendURL = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${frontendURL}/dashboard?token=${token}&name=${encodeURIComponent(user.name)}`);
};
