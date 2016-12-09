/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import cuid from 'cuid';

const Schema = mongoose.Schema;

const authTypes = ['github', 'twitter', 'facebook', 'google'];

const UserSchema = new Schema({
  cuid: { type: String, required: true, default: 'cuid' },
  name: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    required() {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } return false;
    },
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: true,
  },
  provider: String,
  salt: String,
  facebook: {},
});

// Public profile information
UserSchema
  .virtual('profile')
  .get(function profile() {
    return {
      name: this.name,
      role: this.role,
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function token() {
    return {
      cuid: this.cuid,
      userName: this.name,
      role: this.role,
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate((email) => email.length, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate((password) => password.length, 'Password cannot be blank');

UserSchema.path('email').validate((email) => {
  const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The e-mail field is not valid');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function emailValidation(value, respond) {
    const self = this;

    return this.constructor.findOne({
      email: value,
    }).exec()
      .then((user) => {
        if (user) {
          if (self.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch((err) => {
        throw err;
      });
  }, 'The specified email address is already in use.');

const validatePresenceOf = (value) => value && value.length;

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function preSave(next) {
    if (this.cuid === 'cuid') {
      this.cuid = cuid();
    }

    // Handle new/update passwords
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
    const salt = this.makeSalt();
    this.salt = salt;
    this.password = this.encryptPassword(this.password);
    return next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  authenticate(password) {
    let result = false;
    const pwdGen = this.encryptPassword(password);
    if (this.password === pwdGen) {
      result = true;
    }
    return result;
  },

  makeSalt() {
    return crypto.randomBytes(16).toString('base64');
  },

  encryptPassword(password) {
    if (!password || !this.salt) {
      return null;
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');

    return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
        .toString('base64');
  },
};

const User = mongoose.models.User ? mongoose.model('User') : mongoose.model('User', UserSchema);

export default User;
