import React, {useState, useEffect, useContext, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {RootContext} from '../../contexts/index';

export default function Chat({navigation, route}) {
  //   const {user} = useContext(RootContext);

  //   const [sender, setSender] = useState(user.id);
  //   const [reciver, setReciver] = useState(route.params.id);

  //   const [chatOwner, setChatOwner] = useState('');
  //   const [chatRoomId, setChatRoomId] = useState('');
  //   const [messages, setMessages] = useState([]);

  //   const chatOwnerDB = useRef(
  //     database().ref(`users/${chatOwner}`).once('value'),
  //   );

  //   const getChatOwner = () => {
  //     let id = '';
  //     if (reciver > sender) {
  //       id = `${reciver}-${user}`;
  //     } else {
  //       id = `${user}-${reciver}`;
  //     }
  //     setChatOwner(id);
  //   };

  //   const verifyChatOwner = () => {
  //     chatOwnerDB.current.then((snapshot) => {
  //       let authors = snapshot.val().author || [];
  //       let sender = authors.filter((author) => author._id === sender);
  //       let reciver = authors.filter((author) => author._id === reciver);

  //       console.log('verifyChatOwner -> sender', sender);
  //       setSender(sender);
  //       setReciver(reciver);
  //     });
  //   };

  useEffect(() => {
    // getChatOwner();
    // verifyChatOwner();
    // const subscribe = database()
    //   .ref(chatRoomId)
    //   .on('value', (snapshots) => {
    //     const value = snapshots.val();
    //     console.log('Chat -> value', value);
    //   });
    // return () => {
    //   subscribe.off();
    // };
  }, []);

  //   i need : my id, rechiver id, chat room id, room id, chat data.

  // get my id
  // get the reciver id
  // get chat room id from my id + reciver id
  //   verify chat room owner
  // get chat data by chat room id
  // get first 25 chat and loop it

  return (
    <View styles={{flex: 1}}>
      <Text>asdasasdd</Text>
      <GiftedChat
        // styles={{flex: 1}}
        messages={[
          {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
          {
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 1,
              name: 'Yuanda',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ]}
        user={{
          _id: 1,
          name: 'Yuanda',
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
