import Type from '../actions/Type';

const userState = {
  id: '',
  avatar_url: '',
  name: '',
  createdAt: '',
  articles: [{id: '', path: '', love: '', createdAt: ''}],
  chatWith: [{id: '', roomId: ''}],
};

// User/Auth reducer
// To handle auth and set current user.
// here wiil be used for chats, articles, and profile.
export default (state = userState, action) => {
  switch (action.type) {
    case Type.LOGOUT: // * delete all data from redux. default it will deleted every app closed.
      return {};

    case Type.GET_USER: // * get all current user data.
      return state;

    case Type.SET_USER: // * set user, if reauth without login. the function is same as login.
      return {...state, ...action.payload};

    case Type.GET_CONTACTS: // * get user and chat id of user who chat with this user.
      return state.chatWith;

    default:
      return state;
  }
};
