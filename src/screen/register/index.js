import React, {useContext} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-community/google-signin';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {RootContext} from '../../contexts';

import {color} from '../../styles/color';

export default function index({navigation}) {
  const goToRegister = () => {
    navigation.push('register');
  };
  const signInWithGoogle = () => {};

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
            />
          </View>
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
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ulangi password</Text>
            <TextInput
              placeholder="Ulangi password"
              style={styles.textInput}
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity style={styles.loginButton} activeOpacity={0.5}>
            <Text style={styles.loginText}>Register</Text>
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
            <Text>Sudah Punya Akun? </Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={goToRegister}>
              <Text style={styles.registerButtonText}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
