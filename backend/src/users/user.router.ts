import express, { RequestHandler } from 'express';
import { checkToken } from '../middleware/auth.middleware';

export const router = express.Router();
