import React, {useState, useEffect} from 'react';
import firebase from '@react-native-firebase/app';
import Navigation from './navigations';
import {RootContext} from './contexts/index';
import OneSignal from 'react-native-onesignal';
import codePush from 'react-native-code-push';

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

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init('e947c4d9-e3e9-48cf-9e71-ac89f6928ed5', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    OneSignal.addEventListener('ids', onIds);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('received', onRecived);

    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: true,
      },
      syncStatus,
    );

    return () => {
      OneSignal.addEventListener('ids', onIds);
      OneSignal.addEventListener('opened', onOpened);
      OneSignal.addEventListener('received', onRecived);
    };
  }, []);

  const syncStatus = (status) => {
    switch (status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Downloadeing Package');
        break;
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for update');
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log('Update instaled');
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('Up ti date');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing Update');
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('Awaiting user action');
        break;

      default:
        break;
    }
  };

  const onOpened = (notification) => {
    console.log('onOpened -> notification', notification);
  };
  const onRecived = (notification) => {
    console.log('onRecived -> notification', notification);
  };
  const onIds = (notification) => {
    console.log('onIds -> notification', notification);
  };

  // current User
  const [user, setUser] = useState({});

  // App config
  const [isChatScreen, setIsChatScreen] = useState(false);

  return (
    <RootContext.Provider
      value={{user, setUser, isChatScreen, setIsChatScreen}}>
      <Navigation />
    </RootContext.Provider>
  );
};
