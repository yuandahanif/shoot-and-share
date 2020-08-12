import Type from '../actions/Type';
import {act} from 'react-test-renderer';

const articleState = {
  articles: [{id: '', path: '', love: '', createdAt: ''}],
  upload: [],
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

    case Type.GET_ARTICLES: // get all articles.
      return state;

    case Type.SET_ARTICLES: // set all articles.
      return {...state, ...action.payload};

    case Type.UPDATE_ARTICLES: // update article | pagination.
      return {...state, ...action.payload};
    default:
      return state;
  }
};
