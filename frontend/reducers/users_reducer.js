import { merge } from 'lodash';
import {
  RECEIVE_USER_ERRORS,
  RECEIVE_ALL_USERS,
  RECEIVE_SINGLE_USER,
  RECEIVE_ALL_USERS_OF_CHANNEL,
} from '../actions/users_actions';

const defaultState = Object.freeze({
});

export const UsersReducer = (state = defaultState, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_USER_ERRORS:
      return merge({}, state, { errors: action.errors });
    case RECEIVE_SINGLE_USER:
      return action.user;
    case RECEIVE_ALL_USERS_OF_CHANNEL:
      return action.users;
    default:
      return state;
  }
};
