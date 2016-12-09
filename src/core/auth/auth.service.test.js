/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions, no-undef */

import request from 'supertest';
import app from '../../app';
import { User } from '../../data/models';

describe('core auth service', () => {
  const user = {
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password',
  };

  beforeEach('add user', async () => {
    await User.remove({});
    await User.create(user);
  });

  it('Should return 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('authorization', 'Bearer bad.token');
    expect(res.status).to.equal(401);
  });

  it('Should return 403 if no authorization', async () => {
    let res = await request(app)
      .post('/auth/local')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).to.equal(200);
    res = await request(app)
      .get('/api/users')
      .set('authorization', `Bearer ${res.body.token}`);
    expect(res.status).to.equal(403);
  });
});
