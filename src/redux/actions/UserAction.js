import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

import Type from './Type';

// * database ref
const USER_REF = firestore().collection('users');

// * util
const googleConfig = () => {
  GoogleSignin.configure({
    offlineAccess: false,
    webClientId:
      '1023844666896-vcfi0rqodn9unv3kvabqbgtk6f0qn6qf.apps.googleusercontent.com',
  });
};

// dispatcher
const setUser = (payload) => ({
  type: Type.SET_USER,
  payload,
});

const logout = () => ({
  type: Type.LOGOUT,
});

// * LOGIN *********************
export const LoginAction = (email = null, password = null) => {
  return async (dispatch) => {
    // * Login with Google.
    if (!email || !password) {
      try {
        googleConfig();
        await GoogleSignin.hasPlayServices();
        const {idToken} = await GoogleSignin.signIn();
        const Credential = auth.GoogleAuthProvider.credential(idToken);
        const {user} = await auth().signInWithCredential(Credential);

        const uid = user.uid;
        const data = {
          id: uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
          name: user.displayName,
          avatar_url: user.photoURL,
        };
        // * find user in database.
        const userDoc = await USER_REF.doc(uid).get();
        if (userDoc.exists) {
          // * use data from database if user exist.
          dispatch(setUser(userDoc.data()));
        } else {
          // * add new data if user doesn't exist.
          await USER_REF.doc(uid).set(data);
          dispatch(setUser(data));
        }
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('user membatalkan signIn');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('signIn sedang dalam proses');
          alert('sedang masuk, harap tunggu . . . ');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Tidak ada layanan google play service');
          alert('Tidak ada layanan google play service');
        } else {
          console.log('LoginAction -> error', error);
        }
      }
    } else {
      // * Login using username and password.
      try {
        const {user} = await auth().signInWithEmailAndPassword(email, password);
        USER_REF.doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              dispatch(setUser(doc.data()));
            }
          });
      } catch (error) {
        alert(
          'Kesalahan saat login. \nmohon coba beberapa saat lagi.\n' + error,
        );
      }
    }
  };
};

//  * SIMIILAR AS LOGIN.
export const SetUser = (uid) => {
  return async (dispatch) => {
    try {
      const user = await USER_REF.doc(uid).get();
      dispatch(setUser(user.data()));
    } catch (error) {
      console.log('SetUser -> error', error);
    }
  };
};

export const Logout = () => {
  return async (dispatch) => {
    try {
      googleConfig();
      await auth().signOut();
      const data = await GoogleSignin.getCurrentUser();
      if (data) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      dispatch(logout());
    } catch (error) {
      console.log('Logout -> error', error);
    }
  };
};
