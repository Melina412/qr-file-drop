import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import 'dotenv/config';

import app from '../../app';
import { User } from '../../src/users/user.model';
import { createSalt, createHash } from '../../src/auth/auth.service';

process.env.JWT_SECRET = 'secret';

//$ ----- POST /api/auth/register -----
describe('POST /api/auth/register', () => {
  it('should save a new user to the database', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@example.com', password: 'testpassword' });
    // console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'user created');

    const user = await User.findOne({ email: 'newuser@example.com' });
    expect(user).not.toBeNull();
    expect(user?.email).toBe('newuser@example.com');
  });
});

//$ ----- POST /api/auth/login -----
describe('POST /api/auth/login', () => {
  it('should login a user and set cookies', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'login successful');

    // ts hat probleme string in string[] zu konvertieren, dieser schritt ist also notwendig
    let cookies = res.headers['set-cookie'] as unknown;
    // console.log('cookies', cookies);

    // unknown zu string[] konvertieren wenn beide cookies in einem string sind
    if (typeof cookies === 'string') {
      cookies = [cookies];
    }

    if (!Array.isArray(cookies)) {
      throw new Error('no cookies set or wrong cookie format');
    }

    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThanOrEqual(2); // accessCookie + refreshCookie

    const accessCookie = cookies.find((cookie: string) => cookie.startsWith('accessCookie='));
    expect(accessCookie).toBeDefined();

    const refreshCookie = cookies.find((cookie: string) => cookie.startsWith('refreshCookie='));
    expect(refreshCookie).toBeDefined();
  });

  it('should return 401 if email is not found', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'testpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'login failed');
  });

  it('should return 401 if password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'login failed');
  });
});

//$ ----- GET /api/auth/logout -----
describe('GET /api/auth/logout', () => {
  it('should clear cookies on logout', async () => {
    // try { //! zum debuggen try/catch damit test bei error nicht abbricht
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' });

    // console.log('loginResponse body:', loginResponse.body);
    // console.log('set-cookie:', loginResponse.headers['set-cookie']);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('success', true);

    const logoutResponse = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', loginResponse.headers['set-cookie']); // cookies vom login response nehmen

    // console.log('Logout response:', logoutResponse.body);

    expect(logoutResponse.statusCode).toBe(200);
    expect(logoutResponse.body).toHaveProperty('success', true);

    // hier geht das mit dem unknown dann aber nicht
    let cookies = logoutResponse.headers['set-cookie'] as string | string[] | undefined;
    // console.log('cookies', cookies);

    if (typeof cookies === 'string') {
      cookies = [cookies];
    }

    expect(cookies).toBeDefined();

    const accessCookie = cookies.find((cookie: string) => cookie.startsWith('accessCookie='));
    const refreshCookie = cookies.find((cookie: string) => cookie.startsWith('refreshCookie='));

    expect(accessCookie).toMatch(/accessCookie=;/);
    expect(refreshCookie).toMatch(/refreshCookie=;/);

    expect(accessCookie).toMatch(/Expires=Thu, 01 Jan 1970/);
    expect(refreshCookie).toMatch(/Expires=Thu, 01 Jan 1970/);
    // } catch (error) {
    // console.error('Error during logout test:', error);
    // }
  });
});
