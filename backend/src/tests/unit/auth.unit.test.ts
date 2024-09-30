import { expect, test } from 'vitest';
import { createToken, createHash, createSalt, verifyToken } from '../../auth/auth.service';

process.env.JWT_SECRET = 'secret';

test('createToken should create a valid JWT token', () => {
  const token = createToken({ user: 'testuser' }, '1h');
  expect(token).toBeTypeOf('string');
  expect(token.length).toBeGreaterThan(0);
});

test('createToken should correctly decode a JWT token', () => {
  const payload = { user: 'testuser' };
  const token = createToken(payload, '1h');
  const decoded = verifyToken(token);
  expect(decoded).toMatchObject(payload);
});

const hexPattern = /^[0-9a-f]+$/;

test('createHash should create a 64-char hex string', () => {
  const hash = createHash('password', 'salt');
  expect(hash.length).toBe(64);
  expect(hexPattern.test(hash)).toBe(true);
});

test('createSalt should create a 24-char hex string', () => {
  const salt = createSalt();
  expect(salt.length).toBe(24);
  expect(hexPattern.test(salt)).toBe(true);
});
