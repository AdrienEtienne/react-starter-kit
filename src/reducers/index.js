import { combineReducers } from 'redux';
import auth from './auth';
import runtime from './runtime';

export default combineReducers({
  auth,
  runtime,
});
