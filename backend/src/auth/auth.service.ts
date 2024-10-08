import jwt from 'jsonwebtoken';
import { createHmac, randomBytes } from 'crypto';
import type { TokenType } from '../types';
import type { JwtPayload, SignOptions, Jwt } from 'jsonwebtoken';

export function createToken(payload: JwtPayload, expirationTime: SignOptions['expiresIn']) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: expirationTime });
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

export function createSalt() {
  return randomBytes(12).toString('hex');
}

export function createSecret() {
  // für jwt secret 12 bytes
  const secret = randomBytes(12).toString('hex');
  console.log('new secret created:', `JWT_SECRET=${secret}`);
}

export function createNumericalCode(digits: number) {
  const bytes = randomBytes(Math.ceil(digits / 2));
  const code = parseInt(bytes.toString('hex'), 16).toString().slice(0, digits);
  // console.log({ code });
  return code;
}
