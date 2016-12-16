import jwtDecode from 'jwt-decode';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  PROFILE_CHANGE_PASSWORD,
  PROFILE_CHANGE_PASSWORD_SUCCESS,
  PROFILE_CHANGE_PASSWORD_FAILURE,
} from '../constants';

const initialState = {
  token: null,
  userName: null,
  cuid: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
  errors: {},
  role: 'guest',
};

export const isAdmin = (state) => (state.auth && state.auth.role === 'admin');
export const isAuthenticated = (state) => (state.auth.isAuthenticated);

export default function user(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER_REQUEST:
      return Object.assign({}, state, {
        isAuthenticating: true,
        statusText: null,
        errors: {},
      });

    case LOGIN_USER_SUCCESS: {
      const decoded = jwtDecode(action.payload.token);
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token,
        cuid: decoded.cuid,
        userName: decoded.userName,
        role: decoded.role,
        statusText: 'You have been successfully logged in.',
        errors: {},
      });
    }

    case LOGIN_USER_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        userName: null,
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
        errors: action.payload.errors,
      });
    case LOGOUT_USER:
      return Object.assign({}, state, initialState);

    case PROFILE_CHANGE_PASSWORD:
      return Object.assign({}, state, {
        statusText: null,
        errors: {},
      });
    case PROFILE_CHANGE_PASSWORD_SUCCESS:
      return Object.assign({}, state, {
        statusText: 'Password successfully changed.',
        errors: {},
      });
    case PROFILE_CHANGE_PASSWORD_FAILURE:
      return Object.assign({}, state, {
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
        errors: action.payload.errors,
      });
    default:
      return state;
  }
}
