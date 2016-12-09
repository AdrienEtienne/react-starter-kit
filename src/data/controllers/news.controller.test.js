/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions */

import { expect } from 'chai';
import request from 'supertest';
import app from '../../app';

describe('controller news', () => {
  it('should send request', async () => {
    const res = await request(app)
      .get('/api/news');

    expect(res.body).to.have.length(10);
  });
});
