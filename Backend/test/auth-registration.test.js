import test from 'node:test';
import assert from 'node:assert/strict';
import User from '../models/User.js';
import { register } from '../controllers/auth.controller.js';

async function attemptRegistration(body) {
  const originalFindOne = User.findOne;
  const originalCreate = User.create;
  let created;
  User.findOne = async () => null;
  User.create = async (document) => {
    created = document;
    return { _id: 'test-user', toJSON: () => document };
  };
  process.env.JWT_SECRET ??= 'registration-test-access-secret';
  process.env.JWT_REFRESH_SECRET ??= 'registration-test-refresh-secret';
  let response;
  const res = {
    status(code) { response = { status: code }; return this; },
    json(data) { response = { ...response, data }; return this; },
  };
  try {
    await register({ body }, res, (error) => { throw error; });
    return { created, response };
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  }
}

test('public registration always creates a viewer, even when admin is requested', async () => {
  const { created, response } = await attemptRegistration({
    name: 'Test User', email: 'test@example.com', password: 'password123', role: 'admin',
  });
  assert.equal(response.status, 201);
  assert.equal(created.role, 'viewer');
  assert.equal(response.data.data.user.role, 'viewer');
});

test('public registration defaults to viewer when no role is supplied', async () => {
  const { created } = await attemptRegistration({
    name: 'Test User', email: 'test@example.com', password: 'password123',
  });
  assert.equal(created.role, 'viewer');
});
