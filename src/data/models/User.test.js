/* eslint-env mocha */
/* eslint-disable padded-blocks, no-unused-expressions, no-undef */

import User from './User';

describe('data models User', () => {
  let user;

  beforeEach(() => User.remove());
  beforeEach(async () => {
    user = await User.create({ name: 'name', email: 'mail@mail.com', password: 'password' });
  });

  it('should save', async () => {
    expect(user)
      .to
      .contain({ name: 'name', email: 'mail@mail.com' });
  });

  it('should save with hashed password', async () => {
    expect(user.password)
      .to.not.equal('password');
  });

  it('should not save if no name', async () => {
    try {
      await User.create({ email: 'mail@mail.com', password: 'password' });
      assert.fail();
    } catch (error) {
      assert.ok(error);
    }
  });

  describe('authenticate()', () => {
    it('should return true', () => {
      expect(user.authenticate('password')).to.equal(true);
    });
    it('should return false', () => {
      expect(user.authenticate('false password')).to.equal(false);
    });
  });
});
