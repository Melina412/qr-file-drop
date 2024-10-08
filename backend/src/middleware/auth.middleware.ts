import { verifyToken } from '../auth/auth.service';
import { Request, Response, NextFunction } from 'express';
import type { CookieType } from '../types';

export function checkToken(cookieType: CookieType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies[cookieType];
    console.log({ cookieType });
    if (!token) {
      console.log('checkToken: ❌, no valid token');
      res.status(401).end();
      return;
    }
    try {
      // req.payload muss zuerst im interface für express.Request definiert werden
      const payload = verifyToken(token);
      console.log('checkToken: ✅', token.slice(-5));
      req.payload = payload;
      // console.log('token payload:', req.payload);
      next();
    } catch (error) {
      console.error('checkToken error: ', error.message);
      res.status(401).end();
    }
  };
}
