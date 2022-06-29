import { applyMiddleware, compose, combineReducers } from 'redux';
import { legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';
import blockchainReducer from './blockchain/blockchainReducer';

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export default store;
