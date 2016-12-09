import jwt from 'jsonwebtoken';
import { User } from '../../models';
import { auth } from '../../../config';

function validationError(res, statusCode) {
  const code = statusCode || 422;
  return (err) => res.status(code).json(err);
}

function handleError(res, statusCode) {
  const code = statusCode || 500;
  return (err) => res.status(code).send(err);
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
      return null;
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  const newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save()
    .then((user) => {
      const token = jwt.sign(user.token, auth.jwt.secret, {
        expiresIn: 60 * 60 * 5,
      });
      res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  return User.findOne({ cuid: req.params.cuid }).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
      return null;
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findOne({ cuid: req.params.cuid }).exec()
    .then(user => {
      if (!user) return res.status(404).end();
      return user.remove()
        .then(() => res.status(204).end());
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  const oldPass = String(req.body.oldPassword);
  const newPass = String(req.body.newPassword);

  return User.findOne({ cuid: req.user.cuid }).exec()
    .then(user => {
      if (user.authenticate(oldPass)) {
        const u = user;
        u.password = newPass;
        return u.save()
          .then(() => res.status(204).end())
          .catch(validationError(res));
      }

      return res.status(403).end();
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  return User.findOne({ cuid: req.user.cuid }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
      return null;
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
