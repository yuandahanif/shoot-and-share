import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {USER_REF} from './functions/authFunc';
import Type from './Type';
import {isArticleExist} from './functions/articleFunc';

// * Upload Dispatcher.
const setUploadProgress = (payload) => ({
  type: Type.UPLOAD_ARTICLE,
  payload,
});

const updateUploadProgress = (payload) => ({
  type: Type.UPDATE_UPLOAD_ARTICLE,
  payload,
});

const uploadSuccess = (payload) => ({
  type: Type.CLEAR_UPLOAD_ARTICLE,
  payload,
});

const clearUpload = (payload) => ({
  type: Type.CLEAR_UPLOAD_ARTICLE,
  payload,
});

// * Articles Dispatcher.
const setArticles = (payload) => ({
  type: Type.SET_ARTICLES,
  payload,
});

const setArticleLimit = (payload) => ({
  type: Type.SET_ARTICLE_LIMIT,
  payload,
});

const setLastArticle = (payload) => ({
  type: Type.SET_LAST_ARTICLE,
  payload,
});

const updateArticles = (payload) => ({
  type: Type.UPDATE_ARTICLES,
  payload,
});

// * Upload Pic to firebase.
export const UploadArticles = (id, uri) => {
  return (dispatch) => {
    const timestamp = new Date().getTime();
    const fileID = `${id}-${timestamp}`;
    const upload = storage()
      .ref(`/articles/images/${fileID}`)
      .putFile(uri, {cacheControl: 'public, max-age=3600'});

    // cancel upload
    const cancelUpload = () => {
      upload
        .cancel()
        .then(() => {
          dispatch(clearUpload(fileID));
        })
        .catch((error) => {
          console.log('cancelUpload -> error', error);
        });
    };

    dispatch(
      setUploadProgress({
        id: fileID,
        progress: 0,
        message: 'Mulai mengunggah.',
        cancel: cancelUpload,
      }),
    );

    // * Finish upload.
    upload
      .then((snapshot) => {
        const articleRef = firestore().collection('articles');

        articleRef
          .doc(fileID)
          .set({
            id: fileID,
            author: USER_REF.doc(id),
            fileName: snapshot.metadata.fullPath,
            createdAt: firestore.FieldValue.serverTimestamp(),
            love: 0,
          })
          .then(() => {
            isArticleExist(id, fileID).then(() => {
              dispatch(uploadSuccess(fileID));
            });
          })
          .catch((error) => {
            // console.log('UploadArticles -> error', error);
          });
      })
      .catch((error) => {
        // console.log('UploadArticles -> error', error);
      });

    // * On upload process.
    upload.on(
      'state_changed',
      (progress) => {
        let precent = progress.bytesTransferred / progress.totalBytes;
        let precentRound = Math.round(precent);
        dispatch(
          updateUploadProgress({
            id: fileID,
            progress: precentRound,
            message: 'sedang mengunggah.',
            cancel: cancelUpload,
          }),
        );
      },
      (err) => {
        if (err.code === 'storage/canceled') {
          // console.log('UploadArticles -> err.code', err.code);
          // dispatch(cancelUpload(fileID));
        }
        console.log('UploadArticles -> err', err);
      },
    );

    // * On upload error.
    upload.catch((err) => {
      if (err.code === 'storage/cancelled') {
        // dispatch(clearUpload(fileID));
      } else {
        // eslint-disable-next-line no-alert
        alert(err.message);
      }
      console.log('error upload photo -> ', err);
    });
  };
};

// * GET ALL ARTICLES
const articleRef = (limit) =>
  firestore().collection('articles').orderBy('createdAt', 'desc').limit(limit);

export const GetArticles = () => {
  return async (dispatch) => {
    try {
      const documents = await articleRef(4).get();
      let articles = [];
      await Promise.all(
        documents.docs.map(async (doc) => {
          const data = doc.data();
          const res = await data.author.get();
          const author = await res.data();
          const fileName = await storage().ref(data.fileName).getDownloadURL();
          articles.push({...data, author, fileName});
          // Promise.resolve(articles);
        }),
      )
        .then(() => {
          dispatch(setArticleLimit(5));
          dispatch(setArticles(articles));
          dispatch(setLastArticle(documents.docs[documents.docs.length - 1]));
        })
        .catch((err) => {
          console.log('firstArticle -> err', err);
        });
    } catch (error) {
      console.log('return -> error', error);
    }
  };
};

// * Update article pagination.
export const UpdateArticles = (last, limit) => {
  return async (dispatch) => {
    try {
      const documents = await articleRef(limit).startAfter(last).get();
      let articles = [];
      await Promise.all(
        documents.docs.map(async (doc) => {
          const data = doc.data();
          const res = await data.author.get();
          const author = await res.data();
          const fileName = await storage().ref(data.fileName).getDownloadURL();
          articles.push({...data, author, fileName});
        }),
      )
        .then(() => {
          dispatch(setArticleLimit(3));
          dispatch(updateArticles(articles));
          dispatch(setLastArticle(documents.docs[documents.docs.length - 1]));
        })
        .catch((err) => {
          console.log('nextArticles -> err', err);
        });
    } catch (error) {}
  };
};
