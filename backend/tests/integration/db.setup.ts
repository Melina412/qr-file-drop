import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../../src/users/user.model';
import { createSalt, createHash } from '../../src/auth/auth.service';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// beforeEach(async () => {
//   await User.deleteMany({});
// });

beforeEach(async () => {
  const salt = createSalt();
  const hashedPassword = createHash('testpassword', salt);

  await User.create({
    email: 'testuser@example.com',
    password: hashedPassword,
    salt: salt,
  });
  // console.log('🔹 testuser created');
});

afterEach(async () => {
  await User.deleteMany({});
  // console.log('🔸 testuser deleted');
});
