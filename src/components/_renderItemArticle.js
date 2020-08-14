import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Image from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const _renderItemArticle = ({item, openModal, loveArticle}) => {
  const addLove = (id) => {
    loveArticle(id);
    item.love += 1;
  };

  const dateConvert = (time) => {
    const date = new Date(time * 1000);
    let month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
  };

  const ImageArticle = ({uri}) => (
    <View style={styles.imageContainer}>
      <Image
        source={{uri: uri || null}}
        style={styles.image}
        resizeMode={Image.resizeMode.cover}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.author}>
        <TouchableOpacity style={styles.profile}>
          <Image
            source={{uri: item.author && item.author.avatar_url}}
            style={styles.avatar}
            resizeMode={Image.resizeMode.cover}
          />
          <Text style={styles.name}>{item.author && item.author.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="more-vertical"
            size={16}
            onPress={() => openModal(item.author.id)}
          />
        </TouchableOpacity>
      </View>
      <ImageArticle uri={item.fileName} />
      <View style={styles.description}>
        <TouchableOpacity style={styles.love} onPress={() => addLove(item.id)}>
          <Icon name="thumbs-up" size={16} color="red" />
          <Text style={styles.loveCount}>{item.love}</Text>
        </TouchableOpacity>
        <Text>{dateConvert(item.createdAt._seconds)}</Text>
      </View>
    </View>
  );
};

export default _renderItemArticle;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: wp('90%'),
    height: wp('90%'),
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    overflow: 'hidden',
    marginBottom: 15,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  author: {
    padding: 10,
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
    height: 30,
    width: 30,
    resizeMode: 'cover',
    borderRadius: 50,
    overflow: 'hidden',
  },
  name: {
    marginLeft: 10,
  },
  imageContainer: {
    width: '100%',
    height: wp('90%') - 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
  },
  description: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  love: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loveCount: {
    marginLeft: 5,
  },
});
