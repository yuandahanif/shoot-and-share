import Type from '../actions/Type';

const userState = {
  id: '',
  avatar_url: '',
  name: '',
  createdAt: '',
};

const articleState = [];

const contactState = [];

// * User/Auth reducer
// To handle auth and set current user.
// here wiil be used for profile.
export const User = (state = userState, action) => {
  switch (action.type) {
    case Type.LOGOUT: // * delete all data from redux. default it will deleted every app closed.
      return {};

    case Type.GET_USER: // * get all current user data.
      return state;

    case Type.SET_USER: // * set user, if reauth without login. the function is same as login.
      return {...state, ...action.payload};

    default:
      return state;
  }
};

// * users article.
export const UserArticles = (state = articleState, action) => {
  let newState;
  switch (action.type) {
    case Type.SET_USER_ARTICLES: // * Set users article.
      if (state.length !== action.payload.length) {
        return action.payload;
      } else {
        return state;
      }
    default:
      return state;
  }
};

// * user contacts.
export const UserContacts = (state = contactState, action) => {
  switch (action.type) {
    case Type.SET_CONTACTS:
      return [...action.payload];
    case Type.SET_CHAT_ID:
      return [];
    default:
      return state;
  }
};
