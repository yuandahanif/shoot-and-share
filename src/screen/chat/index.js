import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
// TODO: rewrite the logic in firebase function.

const Chat = ({navigation, route, user}) => {
  const sender = {
    _id: user.id,
    name: user.name,
    avatar: user.avatar_url,
  };
  const reciver = route.params.reciverId;
  const [messages, setMessages] = useState([]);
  const chatRoomId = useRef(null);

  const setSenderContact = async () => {
    try {
      const userRef = database().ref(`users/${sender._id}`);
      const senderSnapshot = await userRef.once('value');
      let data = senderSnapshot.val();

      // *check if sender already have chat.
      if (data) {
        // * if sender already have chat with other.
        userRef.set({
          chatWith: {
            ...data.chatWith,
            [reciver]: {
              id: chatRoomId.current,
              lastChat: database.ServerValue.TIMESTAMP,
            },
          },
        });
      } else {
        // * if rechiver have no chat with other.
        userRef.set({
          chatWith: {
            [reciver]: {
              id: chatRoomId.current,
              lastChat: database.ServerValue.TIMESTAMP,
            },
          },
        });
      }
    } catch (error) {
      console.log('setContact -> error ', error);
    }
  };

  const setReciverContact = async () => {
    try {
      const reciverRef = database().ref(`users/${reciver}`);
      const snapshot = await reciverRef.once('value');
      let data = snapshot.val();

      // * check if reciver have any chat before.
      if (data) {
        console.log('setReciverContact -> data', data);
        // * if reciver already have chat with other.
        reciverRef.set({
          chatWith: {
            ...data.chatWith,
            [sender._id]: {
              id: chatRoomId.current,
              lastChat: database.ServerValue.TIMESTAMP,
            },
          },
        });
      } else {
        // * if rechiver have no chat with other.
        reciverRef.set({
          chatWith: {
            [sender._id]: {
              id: chatRoomId.current,
              lastChat: database.ServerValue.TIMESTAMP,
            },
          },
        });
      }
    } catch (error) {
      console.log('setReciverContact -> error', error);
    }
  };

  const onSend = (messages) => {
    // * Push message to database
    messages.forEach((value) => {
      database().ref(`messages/${chatRoomId.current}`).push({
        _id: value._id,
        createdAt: database.ServerValue.TIMESTAMP,
        text: value.text,
        user: value.user,
      });
    });
    setSenderContact();
    setReciverContact();
  };

  const startListener = (id) => {
    database()
      .ref(`messages/${id}`)
      .limitToLast(50)
      .on('child_added', (snapshot) => {
        const value = snapshot.val();
        setMessages((prevState) => GiftedChat.append(prevState, value));
      });
  };

  const getChatRoom = () => {
    let id = '';
    if (reciver > sender._id) {
      id = `${reciver}_${sender._id}`;
    } else {
      id = `${sender._id}_${reciver}`;
    }
    chatRoomId.current = id;
    startListener(id);
  };

  useEffect(() => {
    getChatRoom();
    return () => {
      const db = database().ref(`messages/${chatRoomId.current}`);
      db.off();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* {console.log(messages)} */}
      <GiftedChat onSend={onSend} messages={messages} user={sender} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
  messages: state.UserChats,
});

export default connect(mapStateToProps, null)(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
