import Type from '../actions/Type';

const articleState = {
  articles: [],
  upload: [],
  limit: 3,
  lastArticle: {},
};

// * add article.
export const Article = (state = articleState, action) => {
  let id;
  let updatedState;
  switch (action.type) {
    case Type.UPLOAD_ARTICLE: // data to upload.
      return {
        ...state,
        upload: [...state.upload, action.payload],
      };

    case Type.UPDATE_UPLOAD_ARTICLE: // update upload progress.
      id = action.payload.id;
      updatedState = state.upload.map((val) => {
        if (val.id === id) {
          return {...val, ...action.payload};
        }
        return val;
      });
      return {...state, upload: updatedState};

    case Type.CLEAR_UPLOAD_ARTICLE: // clear the data after upload.
      id = action.payload;
      updatedState = state.upload.filter((val) => val.id !== id);
      return {...state, upload: [...updatedState]};

    case Type.SET_ARTICLES: // set all articles.
      return {...state, articles: [...action.payload]};

    case Type.SET_ARTICLE_LIMIT: // article limit from firebase query.
      return {...state, limit: action.payload};

    case Type.SET_LAST_ARTICLE: // set last article used to update article.
      return {...state, lastArticle: action.payload};

    case Type.UPDATE_ARTICLES: // update article | pagination.
      return {...state, articles: [...state.articles, ...action.payload]};

    case Type.SET_LOVE_ARTICLE:
      id = action.payload;
      updatedState = state.articles.map((val) => {
        if (val.id === id) {
          return {...val, love: val.love + 1};
        }
        return val;
      });
      return {...state, articlse: updatedState};
    default:
      return state;
  }
};
