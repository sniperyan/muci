import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let middle;
if (process.env.NODE_ENV === 'development') {
  middle = composeEnhancers(applyMiddleware(thunkMiddleware));
} else {
  middle = applyMiddleware(thunkMiddleware);
}

export default function configureStore(preloadedState) {
  const store = createStore(
    reducers,
    preloadedState,
    middle
  );
  return store;
}