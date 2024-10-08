import express, { RequestHandler } from 'express';
import { createQrcode, verifyQrcode, verifyEmail, getFile, sendFiles } from './qrcode.controller';
import { checkToken } from '../middleware/auth.middleware';

export const router = express.Router();

router.post('/', checkToken('accessCookie'), createQrcode as RequestHandler);
router.get('/verify/:slug', verifyQrcode as RequestHandler);
router.post('/verify/:slug', verifyEmail as RequestHandler);
router.get('/file', checkToken('qrCodeCookie'), getFile as RequestHandler);
router.get('/sendfile', checkToken('qrCodeCookie'), sendFiles as RequestHandler);
