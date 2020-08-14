import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import {User, UserArticles, UserContacts} from './reducers/UserReducer';

import {Article} from './reducers/ArticleReducer';

const reducers = combineReducers({
  User,
  UserArticles,
  UserContacts,
  Article,
});

export default createStore(reducers, applyMiddleware(thunk));
