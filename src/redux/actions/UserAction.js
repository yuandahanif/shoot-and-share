import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {GoogleSignin} from '@react-native-community/google-signin';

import {
  USER_REF,
  googleConfig,
  googleSiginErrorHandler,
} from './functions/authFunc';
import Type from './Type';

// dispatcher
const setUser = (payload) => ({
  type: Type.SET_USER,
  payload,
});

const logout = () => ({
  type: Type.LOGOUT,
});

const contacts = (payload) => ({
  type: Type.SET_CONTACTS,
  payload,
});

// * LOGIN *********************************
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
        googleSiginErrorHandler(error);
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

//  * SIMIILAR AS LOGIN. *********************************
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

// * REGISTER.
export const RegisterAction = (email, password, name) => {
  return async (dispatch) => {
    try {
      const {user} = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const uid = user.uid;
      const data = {
        id: uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        name: name,
        avatar_url: `https://ui-avatars.com/api/?name=${email}?background=0D8ABC&color=fff`,
      };

      // *Check if user already exist.
      const doc = await USER_REF.doc(uid).get();
      if (doc.exists) {
        dispatch(setUser(doc.data()));
      } else {
        await USER_REF.doc(uid).set(data);
        dispatch(setUser(data));
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(
        'Kesalahan saat mendaftar. \nmohon coba beberapa saat lagi.\n' + error,
      );
    }
  };
};

// * LOGOUT. *********************************
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

// * Get All Contacts.
export const SetContacts = (id) => {
  const userRef = database().ref(`users/${id}`);
  return (dispatch) => {
    userRef.on('child_added', (snapshot) => {
      let data = snapshot.val();
      console.log('SetContacts -> data', data);
      for (const chat in data) {
        // console.log('SetContacts -> chat', chat);
        if (data.hasOwnProperty(chat)) {
          firestore()
            .doc(`users/${chat}`)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const user = doc.data();
                dispatch((prevState) => [
                  ...prevState,
                  {
                    _id: user.id,
                    name: user.name,
                    avatar: user.avatar_url,
                    chatId: chat,
                  },
                ]);
              }
            });
        }
      }
      dispatch(contacts(data));
    });
  };
};

// * Get All Articles Belonges To current users.
export const GetUserArticles = (id) => {
  return (dispatch) => {};
};
