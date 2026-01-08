import CRYPTO from 'crypto';

export const generateSalt = () => {
  return CRYPTO.randomBytes(128).toString('base64');
};

export const generateHashedPassword = (salt, password) => {
  console.log(password);
  return CRYPTO.createHmac('sha256', salt).update(password).digest('hex');
};
