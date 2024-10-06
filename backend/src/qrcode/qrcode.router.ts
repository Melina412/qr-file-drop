import express, { RequestHandler } from 'express';
import { createQrcode, getQrcodes } from './qrcode.controller';

export const router = express.Router();

router.post('/', createQrcode as RequestHandler);
router.get('/', getQrcodes as RequestHandler);
