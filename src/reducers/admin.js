import _ from 'lodash';
import { ADMIN_GET_USERS, ADMIN_GET_USERS_SUCCESS, ADMIN_GET_USERS_FAILURE, ADMIN_REMOVE_USER } from '../constants';

const initialState = {
  users: [],
};

export default function admin(state = initialState, action) {
  switch (action.type) {
    case ADMIN_GET_USERS:
    case ADMIN_GET_USERS_FAILURE:
      return {
        users: [],
      };
    case ADMIN_GET_USERS_SUCCESS:
      return {
        users: action.payload.users,
      };
    case ADMIN_REMOVE_USER:
      return {
        users: _.reject(state.users, { cuid: action.payload.removedUser }),
      };
    default:
      return state;
  }
}
