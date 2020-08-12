import firestore from '@react-native-firebase/firestore';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

//  * Database
export const USER_REF = firestore().collection('users');


// * GoogleSignin
export const googleConfig = () => {
  GoogleSignin.configure({
    offlineAccess: false,
    webClientId:
      '1023844666896-vcfi0rqodn9unv3kvabqbgtk6f0qn6qf.apps.googleusercontent.com',
  });
};

export const googleSiginErrorHandler = (error) => {
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
};
