import express, { RequestHandler } from 'express';
import { checkToken } from '../middleware/auth.middleware';
import { upload } from '../config/storage.config';
import { addFile } from './user.controller';

export const router = express.Router();

router.post('/file/upload', checkToken('accessCookie'), upload.single('file'), addFile as RequestHandler);
