import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import 'dotenv/config';

import { router as authRouter } from './src/auth/auth.router';
import { router as userRouter } from './src/users/user.router';

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export default app;
