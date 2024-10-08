import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import 'dotenv/config';
import path from 'path';

import { router as authRouter } from './src/auth/auth.router';
import { router as userRouter } from './src/users/user.router';
import { router as qrcodeRouter } from './src/qrcodes/qrcode.router';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const FRONTEND_DIR = path.join(__dirname, '../../frontend/dist');
app.use(express.static(FRONTEND_DIR));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/qrcode', qrcodeRouter);

export default app;
