import express, { RequestHandler } from 'express';
import { register, login, logout, protector, refresh, verify } from './auth.controller';
import { checkToken } from '../middleware/auth.middleware';

export const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
router.get('/logout', logout as RequestHandler);
router.get('/protector', checkToken('accessCookie'), protector as RequestHandler);
router.get('/refresh', checkToken('refreshCookie'), refresh as RequestHandler);
router.get('/protector/files', checkToken('qrCodeCookie'), protector as RequestHandler);
router.post('/verify', verify as RequestHandler);
