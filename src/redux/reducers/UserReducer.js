import Type from '../actions/Type';

const userState = {
  id: '',
  avatar_url: '',
  name: '',
  createdAt: '',
};

const articleState = [{id: '', path: '', love: '', createdAt: ''}];

const contactState = [];

const chatsState = {id: '', chats: [], listener: {start: '', stop: ''}};

// User/Auth reducer
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
  switch (action.type) {
    case Type.SET_USER_ARTICLES: // * Set users article.
      return {...state, ...action.payload};
    case Type.GET_USER_ARTICLES: // * Get all users article
      return state;
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

// * User chat.
export const UserChats = (state = chatsState, action) => {
  let newState;

  switch (action.type) {
    case Type.SET_CHAT:
      // if (state.length === 0) {
      //   newState = [action.payload];
      // } else {
      //   newState = state.filter((val) => {
      //     // * if same message exist, update it.
      //     if (val.id === action.payload.id) {
      //       return [...state, {...val, ...action.payload}];
      //     }
      //     // * if no same message | just return it.
      //     return val;
      //   });
      // }
      return {...state, ...action.payload};
    default:
      return state;
  }
};
