import jwt from 'jsonwebtoken';
import { createHmac, randomBytes } from 'crypto';
import type { TokenType } from '../types';
import type { JwtPayload, SignOptions, Jwt } from 'jsonwebtoken';

export function createToken(payload: JwtPayload, expirationTime: SignOptions['expiresIn']) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expirationTime });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // console.log('verifyToken failed:', error.message);
    throw error;
  }
}
export function createHash(password: string, salt: string) {
  const hmac = createHmac('sha256', salt);
  hmac.update(password);
  return hmac.digest('hex');
}
// createHash('password2', 'anothersalt');

export function createSalt() {
  return randomBytes(12).toString('hex');
}

export function createSecret() {
  // für jwt secret 12 bytes
  const secret = randomBytes(12).toString('hex');
  console.log('new secret created:', `JWT_SECRET=${secret}`);
}
// createSecret();
//84ec44c7d6fc41917953a1dafca3c7d7856f7a9d0328b991b76f0d36be1224b9
// console.log(randomBytes(12));
