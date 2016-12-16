
import { logout } from './auth';
import {
  ADMIN_GET_USERS_SUCCESS,
  ADMIN_GET_USERS,
  ADMIN_REMOVE_USER,
} from '../constants';

export function getUsersSuccess(users) {
  return {
    type: ADMIN_GET_USERS_SUCCESS,
    payload: { users },
  };
}

export function getUsersRequest() {
  return {
    type: ADMIN_GET_USERS,
  };
}

export function removeUserSuccess(cuid) {
  return {
    type: ADMIN_REMOVE_USER,
    payload: { removedUser: cuid },
  };
}

export function getUsers() {
  return async (dispatch) => {
    const token = localStorage.getItem('token');
    dispatch(getUsersRequest());

    if (token) {
      const response = await fetch('/api/users', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status >= 400) {
        dispatch(getUsers());
      } else {
        const users = await response.json();
        dispatch(getUsersSuccess(users));
      }
    } else {
      dispatch(logout());
    }
  };
}

export function removeUser(cuid) {
  return async (dispatch) => {
    const token = localStorage.getItem('token');

    if (token) {
      const response = await fetch(`/api/users/${cuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status >= 400) throw new Error('Cannot delete user.');
      else dispatch(removeUserSuccess(cuid));
    } else {
      dispatch(logout());
    }
  };
}
