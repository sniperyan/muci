import {combineReducers} from 'redux';
import about from './about';
import home from './home';

const reducers = {
  about,
  home,
};

export default combineReducers({
  ...reducers,
});