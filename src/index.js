import React, {useState} from 'react';
import firebase from '@react-native-firebase/app';
import Navigation from './navigations';
import {RootContext} from './contexts/index';

export default () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyDds_GL7sW9t11q3y6nychG8XEhvAkaUlY',
    authDomain: 'shoot-and-share-d0476.firebaseapp.com',
    databaseURL: 'https://shoot-and-share-d0476.firebaseio.com',
    projectId: 'shoot-and-share-d0476',
    storageBucket: 'shoot-and-share-d0476.appspot.com',
    messagingSenderId: '1023844666896',
    appId: '1:1023844666896:web:f49c6f8ab0d22ff78c8495',
    measurementId: 'G-TTHF5PS8GT',
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
  }

  const [user, setUser] = useState({});

  return (
    <RootContext.Provider value={{user, setUser}}>
      <Navigation />
    </RootContext.Provider>
  );
};
