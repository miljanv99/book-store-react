import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  if (!token) throw new Error('No token provided');

  try {
    const decoded = jwt.verify(token, process.env.BACKEND_SECRET);

    return decoded.sub;
  } catch (err) {
    throw new Error('Token verification failed');
  }
};

export default verifyToken;
