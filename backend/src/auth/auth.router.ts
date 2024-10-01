import express, { RequestHandler } from 'express';
import { register, login } from './auth.controller';

export const router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);
