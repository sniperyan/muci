import * as types from '../../actions/home';
import initialState from './initialState';

export default function(state = initialState, action) {
  switch (action.type) {
    case types.ADD:
      return {count:state.count + 1};
    default:
      return state;
  }
}