import { merge } from 'lodash';
import {
  RECEIVE_ALL_CHANNELS,
  RECEIVE_SINGLE_CHANNEL,
  RECEIVE_ALL_CHANNELS_OF_USER,
  RECEIVE_CHANNEL_ERRORS,
} from '../actions/channels_actions';

const defaultState = Object.freeze({
  errors: []
});

export const ChannelsReducer = (state = defaultState, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_SINGLE_CHANNEL:
      return merge({}, state, action.channel);
    case RECEIVE_ALL_CHANNELS_OF_USER:
      return merge({}, defaultState, action.channels);
    case RECEIVE_CHANNEL_ERRORS:
      return merge({}, state, {errors: []}, {errors: action.errors});
    default:
      return state;
  }
};
