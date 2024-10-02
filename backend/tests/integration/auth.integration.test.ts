import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import 'dotenv/config';

import app from '../../app';
import { User } from '../../src/users/user.model';
import { createSalt, createHash } from '../../src/auth/auth.service';

describe('POST /api/auth/register', () => {
  it('should save a new user to the database', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'testuser@example.com', password: 'testpassword' });
    // console.log(res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'user created');

    const user = await User.findOne({ email: 'testuser@example.com' });
    expect(user).not.toBeNull();
    expect(user?.email).toBe('testuser@example.com');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    const salt = createSalt();
    const hashedPassword = createHash('testpassword', salt);

    await User.create({
      email: 'testuser@example.com',
      password: hashedPassword,
      salt: salt,
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should login a user and set cookies', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'testpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'login successful');

    // ts hat probleme string in string[] zu konvertieren, dieser schritt ist also notwendig
    let cookies = res.headers['set-cookie'] as unknown;

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
