import express, { RequestHandler } from 'express';
import { createQrcode, verifyQrcode, verifyEmail } from './qrcode.controller';
import { checkToken } from '../middleware/auth.middleware';

export const router = express.Router();

router.post('/', checkToken('accessCookie'), createQrcode as RequestHandler);
router.get('/verify/:slug', verifyQrcode as RequestHandler);
router.post('/verify/:slug', verifyEmail as RequestHandler);
