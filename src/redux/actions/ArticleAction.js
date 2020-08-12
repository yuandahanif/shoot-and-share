import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {USER_REF} from './functions/authFunc';
import Type from './Type';

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

// * Upload Pic to firebase.
export const UploadArticles = (id, uri) => {
  return async (dispatch) => {
    const timestamp = new Date().getTime();
    const fileID = `${id}-${timestamp}`;
    const upload = storage()
      .ref(`/articles/images/${fileID}`)
      .putFile(uri, {cacheControl: 'public, max-age=3600'});

    dispatch(
      setUploadProgress({
        id: fileID,
        progress: 0,
        message: 'Mulai mengunggah.',
      }),
    );

    // * Finish upload.
    upload.then((snapshot) => {
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
          dispatch(uploadSuccess(fileID));
        });
    });

    // * On upload process.
    upload.on('state_changed', (progress) => {
      let precent = (progress.bytesTransferred / progress.totalBytes) * 100;
      let precentRound = Math.round(precent);
      dispatch(
        updateUploadProgress({
          id: fileID,
          progress: precentRound,
          message: 'sedang mengunggah.',
        }),
      );
    });

    // * On upload error.
    upload.catch((err) => {
      alert(err.message);
      console.log('error upload photo -> ', err);
    });
  };
};
