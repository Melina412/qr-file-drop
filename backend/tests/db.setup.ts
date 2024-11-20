import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../src/users/user.model';
import { createSalt, createHash } from '../src/auth/auth.service';
import 'dotenv/config';

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

beforeAll(() => {
  vi.mock('cloudinary', async () => {
    const actual = await vi.importActual('cloudinary');
    return {
      ...actual,
      v2: {
        ...(actual.v2 as object),
        api: {
          delete_resources_by_prefix: vi.fn().mockResolvedValue({
            deleted: { 'test-file-id': 'deleted' },
            deleted_counts: { raw: 1 },
          }),
        },
        uploader: {
          upload: vi.fn().mockResolvedValue({
            success: true,
            fileID: 'mocked-file-id',
            fileURL: 'https://mocked.cloudinary.com/test-file',
            fileName: 'mocked-testfile.txt',
          }),
          destroy: vi.fn().mockResolvedValue({
            result: 'ok',
          }),
        },
      },
    };
  });

  //! mocking ohne den actualImport funktioniert (noch) nicht leider also muss ich die remote tests für die cloudinary operationen vorerst aussetzen
  console.log('🔹 mocking cloudinary API');
});
