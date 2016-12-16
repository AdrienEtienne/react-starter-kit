import history from '../core/history';
import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_FAILURE,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  PROFILE_CHANGE_PASSWORD,
  PROFILE_CHANGE_PASSWORD_SUCCESS,
  PROFILE_CHANGE_PASSWORD_FAILURE,
} from '../constants';

export function loginUserSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token,
    },
  };
}

export function loginUserFailure(status, statusText, errors = {}) {
  localStorage.removeItem('token');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status,
      statusText,
      errors,
    },
  };
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST,
  };
}

export function logout() {
  localStorage.removeItem('token');
  history.push('/login');
  return {
    type: LOGOUT_USER,
  };
}

export function changePasswordRequest() {
  return {
    type: PROFILE_CHANGE_PASSWORD,
  };
}

export function changePasswordSuccess() {
  return {
    type: PROFILE_CHANGE_PASSWORD_SUCCESS,
  };
}

export function changePasswordFailure(errors = {}) {
  return {
    type: PROFILE_CHANGE_PASSWORD_FAILURE,
    payload: {
      errors,
    },
  };
}

export function logoutAndRedirect() {
  return (dispatch) => {
    dispatch(logout());
  };
}

const handleResponse = async (redirect, response, dispatch, token) => {
  try {
    const body = await response.json();
    if (response.status >= 400) {
      let errors = {};
      if (body.errors) errors = body.errors;
      dispatch(loginUserFailure(response.status, response.statusText, errors));
    } else {
      dispatch(loginUserSuccess(token || body.token));
      history.push(redirect);
    }
  } catch (error) {
    dispatch(loginUserFailure(response.status, 'Invalid token'));
    dispatch(logout());
  }
};

export function retrieveUser(redirect = '/') {
  return async (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(loginUserRequest());
      const response = await fetch('/api/users/me', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      handleResponse(redirect, response, dispatch, token);
    } else {
      dispatch(logout());
    }
  };
}

export function loginUser(email, password, redirect = '/') {
  return async (dispatch) => {
    dispatch(loginUserRequest());
    const response = await fetch('/auth/local', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    handleResponse(redirect, response, dispatch);
  };
}

export function signUp(name, email, password, redirect = '/') {
  return async (dispatch) => {
    dispatch(loginUserRequest());
    const response = await fetch('/api/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    handleResponse(redirect, response, dispatch);
  };
}

export function changePassword(oldPassword, newPassword, newPassword2, cuid) {
  return async (dispatch) => {
    if (newPassword !== newPassword2) {
      dispatch(changePasswordFailure({ newPassword2: { message: 'Passwords do not match.' } }));
      return false;
    } else if (newPassword === oldPassword) {
      dispatch(changePasswordFailure({ newPassword: { message: 'New password should be different.' } }));
      return false;
    }
    dispatch(changePasswordRequest());
    const token = localStorage.getItem('token');
    const url = `/api/users/${cuid}/password`;

    const response = await fetch(url, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (response.status === 403) dispatch(changePasswordFailure({ oldPassword: { message: 'Bad password.' } }));
    else if (response.status >= 401) dispatch(logout());
    else if (response.status >= 400) dispatch(changePasswordFailure({ oldPassword: { message: 'Request error.' } }));
    else {
      dispatch(changePasswordSuccess());
      return true;
    }
    return false;
  };
}
