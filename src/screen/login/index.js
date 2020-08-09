import React, {useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {CommonActions} from '@react-navigation/native';
import {RootContext} from '../../contexts';

import {color} from '../../styles/color';
import index from '../splashscreen';

export default ({navigation}) => {
  const {setUser} = useContext(RootContext);

  const goToRegister = () => {
    navigation.push('register');
  };

  // TODO: ADD login func
  const onLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'app'}],
    });
  };

  const onLoginSucces = (data) => {
    // setUser(data);
    navigation.reset({
      index: 0,
      routes: [{name: 'app'}],
    });
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      GoogleSignin.configure({
        offlineAccess: false,
        webClientId:
          '1023844666896-vcfi0rqodn9unv3kvabqbgtk6f0qn6qf.apps.googleusercontent.com',
      });
      const {idToken} = await GoogleSignin.signIn();
      const cred = auth.GoogleAuthProvider.credential(idToken);
      auth()
        .signInWithCredential(cred)
        .then((res) => {
          const userRef = firestore().collection('users');

          const timestamp = firestore.FieldValue.serverTimestamp();
          const uid = res.user.uid;
          const data = {
            id: uid,
            createdAt: timestamp,
            name: res.user.displayName,
            avatar_url: res.user.photoURL,
          };

          userRef
            .doc(uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                onLoginSucces(data);
              } else {
                userRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                    onLoginSucces(data);
                  })
                  .catch((e) => {
                    console.log('firestore -> ', e);
                  });
              }
            });
        })
        .catch((err) => console.log('firebase auth -> ', err));
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
        console.log('Jaringan/Sistem bermasalah', error);
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="password"
              style={styles.textInput}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity
            onPress={onLogin}
            style={styles.loginButton}
            activeOpacity={0.5}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text>OR</Text>
            <View style={styles.line} />
          </View>

          <GoogleSigninButton
            style={{width: '100%', height: 48, elevation: 0}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={signInWithGoogle}
            disabled={null}
          />

          <View style={styles.textRegisterContainer}>
            <Text>Belum Punya Akun? </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={goToRegister}>
              <Text style={styles.registerButtonText}>Buat akun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  form: {
    flex: 2,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    // marginBottom: 5,
    color: color.hitamText,
  },
  textInput: {
    borderBottomColor: color.hitamAbu,
    borderBottomWidth: 1,
    padding: 5,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.biruAir,
    borderRadius: 4,
  },
  loginText: {
    fontSize: 16,
    color: 'white',
  },
  lineContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line: {
    flex: 0.45,
    backgroundColor: 'gray',
    height: 1,
  },
  textRegisterContainer: {
    flexDirection: 'row',
    marginTop: 'auto',
    marginBottom: 15,
    alignSelf: 'center',
  },
  registerButton: {
    color: 'darkblue',
  },
  registerButtonText: {
    color: '#3EC6FF',
  },
});
