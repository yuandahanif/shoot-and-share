import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import {
  User,
  UserArticles,
  UserContacts,
  UserChats,
} from './reducers/UserReducer';

import {Article} from './reducers/ArticleReducer';

const reducers = combineReducers({
  User,
  UserArticles,
  UserContacts,
  UserChats,
  Article,
});

export default createStore(reducers, applyMiddleware(thunk));
