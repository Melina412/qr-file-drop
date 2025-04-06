import { log } from 'console';
import app from './app';
import { dbConnect } from './src/storage/storage.config';
import 'dotenv/config';
import path from 'path';

const PORT = process.env.PORT || 3000;

const PROJECT_ROOT = process.cwd();
const directory = __dirname;

// console.log({ PROJECT_ROOT });
// console.log({ directory });
console.log('NODE_ENV', process.env.NODE_ENV);

const FRONTEND_INDEX = path.join(__dirname, '../../frontend/dist/index.html');

app.get('*', (_, res) => {
  res.sendFile(FRONTEND_INDEX);
});

app.listen(PORT, () => {
  dbConnect(), console.log('✅ express server on port', PORT);
});
