import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {USER_REF} from './functions/authFunc';
import Type from './Type';
import {isArticleExist} from './functions/articleFunc';

// * Dispatcher.
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

// * Upload Pic to firebase.
export const UploadArticles = (id, uri) => {
  return (dispatch) => {
    const timestamp = new Date().getTime();
    const fileID = `${id}-${timestamp}`;
    const upload = storage()
      .ref(`/articles/images/${fileID}`)
      .putFile(uri, {cacheControl: 'public, max-age=3600'});

    const cancelUpload = () => {
      upload
        .cancel()
        .then((data) => {
          dispatch(clearUpload(fileID));
          console.log('cancelUpload -> data', data);
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
          dispatch(cancelUpload(fileID));
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
