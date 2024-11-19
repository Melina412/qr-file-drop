import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import 'dotenv/config';

import app from '../../app';
import { User } from '../../src/users/user.model';
import { Qrcode } from '../../src/qrcodes/qrcode.model';

process.env.JWT_SECRET = 'secret';

// login mit beforeAll ging nicht weil ich jeweils auf die cookies vom loginResponse zugreifen muss und noch nicht rausgefunden habe, ob ich die returnen kann

afterAll(async () => {
  const logoutResponse = await request(app).get('/api/auth/logout');
  expect(logoutResponse.statusCode).toBe(200);
  expect(logoutResponse.body).toHaveProperty('message', 'logout successful');
});

//$ ----- GET /api/user/files -----
describe('GET /api/user/files', () => {
  it('should return an array of files', async () => {
    // try { //! try/catch debugging

    //* LOGIN UND COOKIES FÜR FILE UPLOAD CREDENTIALS
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' });
    let cookies = loginResponse.headers['set-cookie'] as unknown;
    if (typeof cookies === 'string') {
      cookies = [cookies];
    }
    if (!Array.isArray(cookies)) {
      throw new Error('no cookies set or wrong cookie format');
    }

    //* TEST FILE UPLOAD
    const uploadFile = await request(app)
      .post('/api/user/file')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .attach('file', './tests/integration/testfile.txt')
      .field('fileName', 'testfile.txt');

    if (uploadFile.ok) {
      const res = await request(app).get('/api/user/files').set('Cookie', loginResponse.headers['set-cookie']);
      console.log('res.body', res.body);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'files found');
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.statusCode).toBe(200);
    }

    //! ????
    //* FILE WIEDER LÖSCHEN
    // } catch (error) {
    //   console.error('Error during getFiles test:', error);
    // }
  });
});

//$ ----- POST /api/user/file -----

//$ ----- DELETE /api/user/file -----

//$ ----- GET /api/user/qrcodes -----
