import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import {color} from '../../styles/color'

export default function index() {
  return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.appName}>Shoot and Share</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: 'auto',
    resizeMode: 'center',
  },
  appName: {
    // alignSelf: 'flex-end',
    marginTop: 'auto',
    justifyContent: 'flex-end',
    marginBottom: 30,
    color: color.hitamText,
  },
});
