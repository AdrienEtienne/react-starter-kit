import { combineReducers } from 'redux';
import admin from './admin';
import auth from './auth';
import runtime from './runtime';

export default combineReducers({
  auth,
  admin,
  runtime,
});
