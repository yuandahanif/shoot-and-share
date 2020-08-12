import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import {
  User,
  UserArticles,
  UserContacts,
  UserChats,
} from './reducers/UserReducer';

const reducers = combineReducers({User, UserArticles, UserContacts, UserChats});

export default createStore(reducers, applyMiddleware(thunk));
