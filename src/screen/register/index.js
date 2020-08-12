import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

import {RegisterAction} from '../../redux/actions/UserAction';
import {color} from '../../styles/color';

const Register = ({navigation, RegisterAction}) => {
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
          RegisterAction(email, password, name);
        }
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
            <Text style={styles.label}>Nama</Text>
            <TextInput
              placeholder="Nama"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={(text) => setName(text)}
              autoCapitalize="words"
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

// const mapStateToProps = (state) => ({
// : state.,
// });

const mapDispatchToProps = (dispatch) => {
  return {
    RegisterAction: (...data) => dispatch(RegisterAction(...data)),
  };
};

export default connect(null, mapDispatchToProps)(Register);

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
