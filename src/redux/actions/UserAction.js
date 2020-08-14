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

const setContacts = (payload) => ({
  type: Type.SET_CONTACTS,
  payload,
});

const setChat = (payload) => ({
  type: Type.SET_CHAT,
  payload,
});

const setChatMethod = (payload) => ({
  type: Type.SET_CHAT,
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
    userRef.on('child_added', async (snapshot) => {
      let temp = [];
      let data = snapshot.val();
      for (const chat in data) {
        if (data.hasOwnProperty(chat)) {
          const doc = await firestore().doc(`users/${chat}`).get();
          if (doc.exists) {
            const user = doc.data();
            temp.push({
              _id: user.id,
              name: user.name,
              avatar: user.avatar_url,
              reciverId: chat,
              chatId: data[chat],
            });
          }
        }
      }
      dispatch(setContacts(temp));
    });
  };
};

// * Set chat data with spesific user
export const SetUserChat = (sender, reciver) => {
  return async (dispatch) => {
    let id = '';
    if (reciver > sender) {
      id = `${reciver}_${sender}`;
    } else {
      id = `${sender}_${reciver}`;
    }

    // * setup listener to get the message every new chat added.
    const startListener = (id) => {
      database()
        .ref(`messages/${id}`)
        .limitToLast(50)
        .on('child_added', (snapshot) => {
          const data = snapshot.val();
          dispatch(setChat({chats: data}));
          // setMessages((prevState) => GiftedChat.append(prevState, value));
        });
    };

    // *stop listener
    const stopListener = (id) => {
      const db = database().ref(`messages/${id}`);
      if (db) {
        db.off();
      }
    };

    // * Saat pesan dikirim
    const onSend = (id, sender, reciver, messages) => {
      // * get chat room id from database.
      const userRef = database().ref(`users/${sender}`);
      const reciverRef = database().ref(`users/${reciver}`);

      userRef.once('value').then((snapshot) => {
        let data = snapshot.val();
        if (data) {
          // * add new record to sender database.
          userRef.set({
            chatWith: {
              [reciver]: {id, lastChat: database.ServerValue.TIMESTAMP},
            },
          });
        } else {
          userRef.set({
            chatWith: {
              ...data.chatWith,
              [reciver]: {id, lastChat: database.ServerValue.TIMESTAMP},
            },
          });
        }

        // * check if reciver have any chat before.
        reciverRef.once('value').then((snapshot) => {
          let data = snapshot.val();

          // * if reciver already have chat with other.
          if (data) {
            reciverRef.set({
              chatWith: {...data.chatWith, [sender]: id},
            });
          } else {
            // * if rechiver have no chat with other.
            reciverRef.set({
              chatWith: {[sender]: id},
            });
          }
        });
      });

      // * Push message to database.
      messages.forEach((value) => {
        database().ref(`messages/${id}`).push({
          _id: value._id,
          createdAt: database.ServerValue.TIMESTAMP,
          text: value.text,
          user: value.user,
        });
        
      });
      // setMessages((prevState) => GiftedChat.append(prevState, messages));
    };

    dispatch(
      setChatMethod({
        id,
        onSend,
        listener: {stop: stopListener, start: startListener},
      }),
    );
  };
};

// * Get All Articles Belonges To current users.
export const GetUserArticles = (id) => {
  return (dispatch) => {};
};
