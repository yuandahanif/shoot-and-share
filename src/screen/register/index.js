import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {color} from '../../styles/color';

export default ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const goToLogin = () => {
    navigation.push('login');
  };

  const registerHandler = () => {
    if (password !== '' && password === repeatPassword) {
      if (name !== '') {
        if (email !== '') {
          auth()
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
              const userRef = firestore().collection('users');

              const timestamp = firestore.FieldValue.serverTimestamp();
              const uid = res.user.uid;
              const data = {
                id: uid,
                createdAt: timestamp,
                name: name,
                avatar_url: `https://ui-avatars.com/api/?name=${email}?background=0D8ABC&color=fff`,
              };

              userRef
                .doc(uid)
                .get()
                .then((doc) => {
                  if (doc.exists) {
                    onRegisterSucces();
                  } else {
                    userRef
                      .doc(uid)
                      .set(data)
                      .then(() => {
                        onRegisterSucces();
                      })
                      .catch((e) => {
                        console.log('firestore -> ', e);
                      });
                  }
                });
            })
            .catch((err) => {
              alert(
                'Kesalahan saat mendaftar. \nmohon coba beberapa saat lagi.\n' +
                  err,
              );
            });
        }
      }
    }
  };

  const onRegisterSucces = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'app'}],
    });
  };

  // const signInWithGoogle = () => {};

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              placeholder="Nama"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              autoCompleteType="email"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="password"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setPassword(text)}
              autoCompleteType="password"
              secureTextEntry={true}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ulangi password</Text>
            <TextInput
              placeholder="Ulangi password"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setRepeatPassword(text)}
              autoCompleteType="password"
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={registerHandler}
            activeOpacity={0.5}>
            <Text style={styles.loginText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.textRegisterContainer}>
            <Text>Sudah Punya Akun? </Text>
            <TouchableOpacity style={styles.registerButton} onPress={goToLogin}>
              <Text style={styles.registerButtonText}>Masuk</Text>
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
