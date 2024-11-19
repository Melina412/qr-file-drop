import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import 'dotenv/config';

import app from '../../app';
import { User } from '../../src/users/user.model';
import { Qrcode } from '../../src/qrcodes/qrcode.model';

process.env.JWT_SECRET = 'secret';

//? login mit beforeAll ging nicht weil ich jeweils auf die cookies vom loginResponse zugreifen muss und noch nicht rausgefunden habe, ob ich die returnen kann
//? files löschen etc. auch nicht, dafür muss ich noch eine lösung finden

afterAll(async () => {
  const logoutResponse = await request(app).get('/api/auth/logout');
  expect(logoutResponse.statusCode).toBe(200);
  expect(logoutResponse.body).toHaveProperty('message', 'logout successful');
});

//$ ----- POST /api/user/file -----
describe('POST /api/user/file', () => {
  it('should upload a file', async () => {
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

    const res = await request(app)
      .post('/api/user/file')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .attach('file', './tests/integration/testfile.txt')
      .field('fileName', 'testfile.txt');

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'file added');

    //! erstmal alle, ggf noch ändern
    //* FILE WIEDER LÖSCHEN
    const deleteFilesResponse = await request(app)
      .delete('/api/user/folder')
      .set('Cookie', loginResponse.headers['set-cookie']);
    expect(deleteFilesResponse.statusCode).toBe(200);
    expect(deleteFilesResponse.body.details).toHaveProperty('cloudinaryResponse', '❎ cloudinary folder deleted');
    expect(deleteFilesResponse.body).toHaveProperty('message', 'folder deleted from db');
  });
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

    //! ggf ändern
    //* FILES WIEDER LÖSCHEN
    const deleteFilesResponse = await request(app)
      .delete('/api/user/folder')
      .set('Cookie', loginResponse.headers['set-cookie']);
    expect(deleteFilesResponse.statusCode).toBe(200);
    expect(deleteFilesResponse.body.details).toHaveProperty('cloudinaryResponse', '❎ cloudinary folder deleted');
    expect(deleteFilesResponse.body).toHaveProperty('message', 'folder deleted from db');
    // } catch (error) {
    //   console.error('Error during getFiles test:', error);
    // }
  });
});

//$ ----- DELETE /api/user/file -----

//$ ----- GET /api/user/qrcodes -----
