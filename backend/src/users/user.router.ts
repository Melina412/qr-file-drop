import express, { RequestHandler } from 'express';
import { checkAccessToken } from '../middleware/auth.middleware';

export const router = express.Router();
