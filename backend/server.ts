import app from './app';
import { dbConnect } from './src/config/storage.config';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  dbConnect(), console.log('✅ express server on port', PORT);
});
