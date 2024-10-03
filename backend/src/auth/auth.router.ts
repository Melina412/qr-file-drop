import express, { RequestHandler } from 'express';
import { register, login, logout, protector, refresh, verify } from './auth.controller';
import { checkAccessToken } from '../middleware/auth.middleware';

export const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/logout', logout as RequestHandler);
router.get('/protector', checkAccessToken('accessCookie'), protector as RequestHandler);
router.get('/refresh', checkAccessToken('refreshCookie'), refresh as RequestHandler);
router.get('/protector/files', checkAccessToken('qrCodeCookie'), protector as RequestHandler);
router.post('/verify', verify as RequestHandler);
