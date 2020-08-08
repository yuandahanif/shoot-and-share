const chat = {
  users: {
    //TODO: chat app schema . and dont forget add this chat id to the firestore.
    //id adalah gabungan 2 id user dengan aturan urutan id user yang lebih besar berada di depan "id_user_2-id_user_1"
    'id-message-1': {
      'chat-id': 'chat-id-1',
      author: [
        {
          _id: 1,
          name: 'user 1',
          avatar: 'https://placeimg.com/140/140/any',
        },
        {
          _id: 2,
          name: 'user 2',
          avatar: 'https://placeimg.com/140/140/any',
        },
      ],
      createdAt: 'server time',
    },
    'id-message-2': {
      'chat-id': 'chat-id-1',
      author: {
        user1: {
          _id: 1,
          name: 'user 1',
          avatar: 'https://placeimg.com/140/140/any',
        },
        user2: {
          _id: 2,
          name: 'user 2',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    },
  },

  // * cahts
  chats: {
    'chat-id-1': [
      {
        _id: '' | 0,
        text: 'the message',
        createdAt: Date | 0,
        user: {
          //reference to users 1 or 2 we used before
        },
        image: '',
        video: '',
        audio: '',
        system: false,
        sent: false,
        received: false,
        pending: false,
        // quickReplies: QuickReplies,
      },
      {
        _id: '' | 0,
        text: 'the message',
        createdAt: Date | 0,
        user: {
          //reference to users 1 or 2 we used before
        },
        image: '',
        video: '',
        audio: '',
        system: false,
        sent: false,
        received: false,
        pending: false,
        // quickReplies: QuickReplies,
      },
    ],
    'chat-id-2': [
      {
        _id: '' | 0,
        text: 'the message',
        createdAt: Date | 0,
        user: {
          //reference to users 1 or 2 we used before
        },
        image: '',
        video: '',
        audio: '',
        system: false,
        sent: false,
        received: false,
        pending: false,
        // quickReplies: QuickReplies,
      },
      {
        _id: '' | 0,
        text: 'the message',
        createdAt: Date | 0,
        user: {
          //reference to users 1 or 2 we used before
        },
        image: '',
        video: '',
        audio: '',
        system: false,
        sent: false,
        received: false,
        pending: false,
        // quickReplies: QuickReplies,
      },
    ],
  },
};
