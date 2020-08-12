import React, {useState, useEffect, useContext, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {RootContext} from '../../contexts/index';

// TODO: ganti aja get user jangan dari context.
// TODO: rewrite the logic in firebase function.

export default ({navigation, route}) => {
  const {user} = useContext(RootContext);

  const [sender, setSender] = useState({
    _id: 1,
    name: '-',
    avatar: '-',
  });
  const [reciver, setReciver] = useState(route.params.reciverId);
  const [messages, setMessages] = useState([]);
  const ownerID = useRef(null);
  const [newChat, setNewChat] = useState(false);

  const getUser = async () => {
    if (!user) {
      const uid = auth().currentUser.uid;
      const doc = await firestore().doc(`users/${uid}`).get();
      const data = doc.data();
      const newUser = {
        _id: data.id,
        name: data.name,
        avatar: data.avatar_url,
      };
      setSender(newUser);
      return newUser;
    } else {
      const newUser = {
        _id: user.id,
        name: user.name,
        avatar: user.avatar_url,
      };
      setSender(newUser);
      return newUser;
    }
  };

  const onSend = (messages) => {
    // * Push message to database
    messages.forEach((value) => {
      database().ref(`messages/${ownerID.current}`).push({
        _id: value._id,
        createdAt: database.ServerValue.TIMESTAMP,
        text: value.text,
        user: value.user,
      });
    });

    if (newChat) {
      database()
        .ref(`users/${sender._id}`)
        .set({
          chatWith: {[reciver]: ownerID.current},
        });

      const reciverRef = database().ref(`users/${reciver}`);
      reciverRef.once('value').then((snapshot) => {
        let data = snapshot.val();
        if (data) {
          reciverRef.set({
            chatWith: {...data.chatWith, [sender._id]: ownerID.current},
          });
        } else {
          reciverRef.set({
            chatWith: {[sender._id]: ownerID.current},
          });
        }
      });
    }
    // setMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  const getMessages = (id = null) => {
    database()
      .ref(`messages/${ownerID.current || id}`)
      .limitToLast(50)
      .on('child_added', (snapshot) => {
        const value = snapshot.val();
        setMessages((prevState) => GiftedChat.append(prevState, value));
      });
  };

  const getChatID = ({user, id}) => {
    const ref = sender._id === 1 ? user._id : sender._id;
    const userRef = database().ref(`users/${ref}`);
    userRef.once('value').then((snapshot) => {
      let data = snapshot.val();
      if (data) {
        userRef.set({chatWith: {...data.chatWith, [reciver]: id}});

        const reciverRef = database().ref(`users/${reciver}`);
        reciverRef.once('value').then((snapshot) => {
          let data = snapshot.val();

          if (data) {
            reciverRef.set({
              chatWith: {...data.chatWith, [ref]: id},
            });
          } else {
            reciverRef.set({
              chatWith: {[ref]: id},
            });
          }
        });
      } else {
        setNewChat(true);
      }
    });
    getMessages(id);
  };

  const getChatRoom = (data) => {
    let id = '';
    const user = sender._id === 1 ? data : sender;
    if (reciver > user._id) {
      id = `${reciver}_${user._id}`;
    } else {
      id = `${user._id}_${reciver}`;
    }
    ownerID.current = id;
    getChatID({user, id});
  };

  useEffect(() => {
    const init = async () => {
      const data = await getUser();
      getChatRoom(data);
    };
    init();
    return () => {
      const db = database().ref(`messages/${ownerID.current}`);
      db.off();
    };
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat onSend={onSend} messages={messages} user={sender} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
