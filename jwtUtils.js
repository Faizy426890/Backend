// jwtUtils.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const generateToken = (user) => {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
