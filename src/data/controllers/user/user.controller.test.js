/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions, no-undef */

import request from 'supertest';
import app from '../../../app';
import { User } from '../../models';

// Initial users added into test db
const user = {
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
  password: 'password',
};

let token;
let u;

describe('data controllers users', () => {
  beforeEach('remove and add users', async () => {
    await User.remove({});
    u = await User.create(user);
  });
  beforeEach('remove and add users', async () => {
    const res = await request(app)
      .post('/auth/local')
      .send({ email: 'admin@example.com', password: 'password' });

    token = res.body.token;
    expect(res.status).to.equal(200);
    expect(res.body.token).to.exist;
  });

  it('Should return users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('authorization', `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.length).to.equal(1);
  });

  it('Should return me', async () => {
    const res = await request(app)
    .get('/api/users/me')
    .set('authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.cuid).to.equal(u.cuid);
  });

  it('Should create user', async () => {
    const res = await request(app)
    .post('/api/users')
    .send({ email: 'new@mail.com', name: 'new', password: 'password' });
    expect(res.status).to.equal(200);
    expect(res.body.token).to.exist;
  });

  it('Should return 422 on POST with taken email', async () => {
    const res = await request(app)
    .post('/api/users')
    .send({ email: 'admin@example.com', name: 'new', password: 'password' });
    expect(res.status).to.equal(422);
  });

  it('Should remove user', async () => {
    const res = await request(app)
      .delete(`/api/users/${u.cuid}`)
      .set('authorization', `Bearer ${token}`);
    expect(res.status).to.equal(204);
  });

  it('Should return 404 on remove user not found', async () => {
    const res = await request(app)
    .delete('/api/users/moncuidfake')
    .set('authorization', `Bearer ${token}`);
    expect(res.status).to.equal(404);
  });

});

