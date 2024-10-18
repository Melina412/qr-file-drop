import express, { RequestHandler } from 'express';
import { checkToken } from '../middleware/auth.middleware';
import { upload } from '../config/storage.config';
import { addFile, getUserFiles, deleteFile } from './user.controller';

export const router = express.Router();

router.post('/file/upload', checkToken('accessCookie'), upload.single('file'), addFile as RequestHandler);
router.get('/files', checkToken('accessCookie'), getUserFiles as RequestHandler);
router.delete('/file', checkToken('accessCookie'), deleteFile as RequestHandler);
