import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import UserReducer from './reducers/UserReducer';

const reducers = combineReducers({User: UserReducer});

export default createStore(reducers, applyMiddleware(thunk));
