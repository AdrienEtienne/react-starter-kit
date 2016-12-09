import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import { auth } from '../../config';
import { User } from '../../data/models';

const validateJwt = expressJwt({
  secret: auth.jwt.secret,
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
export function isAuthenticated() {
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      const request = req;

      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.access_token) {
        request.headers.authorization = `Bearer ${req.query.access_token}`;
      }
     // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
      if (req.query && typeof req.headers.authorization === 'undefined') {
        request.headers.authorization = `Bearer ${req.cookies.token}`;
      }
      validateJwt(request, res, next);
    })
    // Attach user to request
    .use((req, res, next) => {
      const request = req;
      User.findOne({ cuid: req.user.cuid }).exec()
        .then(user => {
          if (!user) {
            return res.status(401).end();
          }
          request.user = user;
          next();
          return null;
        })
        .catch(err => next(err));
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
export function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }

  return compose()
    .use(isAuthenticated())
    .use((req, res, next) => {
      if (auth.userRoles.indexOf(req.user.role) >= auth.userRoles.indexOf(roleRequired)) {
        return next();
      }
      return res.status(403).send('Forbidden');
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
export function signToken(obj) {
  return jwt.sign(obj, auth.jwt.secret, {
    expiresIn: 60 * 60 * 5,
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
export function setTokenCookie(req, res) {
  if (!req.user) {
    return res.status(404).send('It looks like you aren\'t logged in, please try again.');
  }
  const token = signToken(req.user.cuid, req.user.name, req.user.role);
  res.cookie('token', token);
  res.redirect('/');
  return null;
}
