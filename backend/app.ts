import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import 'dotenv/config';

import { dbConnect } from './src/config/storage.config';

import { router as authRouter } from './src/auth/auth.router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  dbConnect(), console.log('✅ express server on port', PORT);
});
