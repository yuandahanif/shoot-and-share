import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Image from 'react-native-fast-image';
import ProgressBar from 'react-native-progress/Bar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {color} from '../styles/color';

const _headerArticles = ({user, navigation, progress}) => {
  const gotoProfile = () => navigation.navigate('profile');
  const gotoChatList = () => navigation.navigate('Contacts', {id: user.id});

  return (
    <>
      <View style={styles.author}>
        <TouchableOpacity style={styles.profile} onPress={gotoProfile}>
          <Image
            source={{uri: user && user.avatar_url}}
            style={styles.avatar}
            resizeMode={Image.resizeMode.cover}
          />
          <Text style={styles.name}>{user && user.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={gotoChatList}>
          <Icon name="message-square" size={20} color={color.hitamAbu} />
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <Image
          source={{uri: user && user.avatar_url}}
          style={styles.avatar}
          resizeMode={Image.resizeMode.cover}
        />
        <View style={styles.progress}>
          <Text style={styles.progressText}>30%</Text>
          <ProgressBar
            progress={0.3}
            indeterminate={true}
            width={null}
            color={'rgba(0, 0, 0, 0.5)'}
            borderColor={'rgba(0, 0, 0, 0.5)'}
            unfilledColor={'rgba(255, 255, 255, 1)'}
            borderRadius={1}
          />
        </View>
        <TouchableOpacity style={styles.progressCancel}>
          <Icon name="x" color={color.hitamText} size={hp(2)} />
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <Image
          source={{uri: user && user.avatar_url}}
          style={styles.avatar}
          resizeMode={Image.resizeMode.cover}
        />
        <View style={styles.progress}>
          <Text style={styles.progressText}>30%</Text>
          <ProgressBar
            progress={0.3}
            indeterminate={true}
            width={null}
            color={'rgba(0, 0, 0, 0.5)'}
            borderColor={'rgba(0, 0, 0, 0.5)'}
            unfilledColor={'rgba(255, 255, 255, 1)'}
            borderRadius={1}
          />
        </View>
      </View>
    </>
  );
};

export default _headerArticles;

const styles = StyleSheet.create({
  author: {
    // marginBottom: hp(2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: 'grey',
    resizeMode: 'cover',
    borderRadius: 50,
    overflow: 'hidden',
  },
  name: {
    marginLeft: 10,
    fontSize: 16,
  },
  progressContainer: {
    paddingHorizontal: wp(4),
    // paddingTop: hp(2),
    // paddingBottom: hp(2),
    paddingVertical: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  progress: {
    flex: 1,
    alignItems: 'stretch',
    marginHorizontal: 5,
  },
  progressText: {
    color: color.hitamText,
    // paddingBottom: hp(0.5),
    alignSelf: 'flex-end',
  },
  progressCancel: {
    padding: wp(1),
  },
});
