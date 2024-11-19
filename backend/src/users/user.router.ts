import express, { RequestHandler } from 'express';
import { checkToken } from '../middleware/auth.middleware';
import { upload } from '../storage/storage.config';
import { addFile, getUserFiles, deleteFile, deleteAllFiles } from './user.controller';

export const router = express.Router();

router.post('/file', checkToken('accessCookie'), upload.single('file'), addFile as RequestHandler);
router.get('/files', checkToken('accessCookie'), getUserFiles as RequestHandler);
router.delete('/file', checkToken('accessCookie'), deleteFile as RequestHandler);
router.delete('/folder', checkToken('accessCookie'), deleteAllFiles as RequestHandler);
