import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const DEVICE = Dimensions.get('window');

export default function index() {
  const data = [
    {
      uid: '131412412412',
      name: 'snowsant',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/snowsant-profile.png'),
      like: 123,
    },
    {
      uid: '1314124112',
      name: 'snowsant',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/snowsant-profile.png'),
      like: 123,
    },
    {
      uid: '1312412412',
      name: 'snowsant',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/snowsant-profile.png'),
      like: 123,
    },
    {
      uid: '13141241241',
      name: 'query',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/undraw_camera_mg5h.png'),
      like: 122,
    },
    {
      uid: '1314124124',
      name: 'hoshhi',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/undraw_camera_mg5h.png'),
      like: 121,
    },
  ];

  const _renderItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={item.image_url} />
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={_renderItem}
      keyExtractor={(data) => data.uid}
      horizontal={false}
      numColumns={3}
      contentContainerStyle={styles.flatList}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    justifyContent: 'center',
    marginHorizontal: (DEVICE.width - (DEVICE.width / 3 - 50 / 3) * 3) / 2,
  },
  imageContainer: {
    width: DEVICE.width / 3 - 50 / 3,
    height: DEVICE.width / 3 - 50 / 3,
    margin: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
