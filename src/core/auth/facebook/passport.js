 /* eslint-disable no-underscore-dangle */

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export default function setup(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.id,
    clientSecret: config.facebook.secret,
    callbackURL: config.facebook.callbackURL,
    profileFields: [
      'displayName',
      'emails',
    ],
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ 'facebook.id': profile.id }).exec()
      .then(user => {
        if (user) {
          return done(null, user);
        }
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          provider: 'facebook',
          facebook: profile._json,
        });
        return newUser.save()
          .then(savedUser => done(null, savedUser))
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }));
}
