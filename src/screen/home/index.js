import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {color} from '../../styles/color';
import firestore from '@react-native-firebase/firestore';
import {RootContext} from '../../contexts';

export default ({navigation}) => {
  const {user} = useContext(RootContext);

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const subscribe = firestore()
      .collection('articles')
      .onSnapshot((querySnapshot) => {
        const articles = [];

        querySnapshot.forEach((documentSnapshot) => {
          articles.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        console.log(articles);
        setArticles(articles);
      });
    return () => subscribe();
  }, []);

  // const getAtricle = async () => {
  //   const articleRef = firestore().collection('articles');
  //   articleRef.orderBy('createdAt', 'asc').onSnapshot(
  //     (QuerySnapshot) => {
  //       setArticles(QuerySnapshot.docs);
  //       console.log(QuerySnapshot);
  //     },
  //     (err) => {
  //       console.log(err);
  //     },
  //   );
  // };

  const gotoProfile = () => navigation.navigate('profile');

  const data = [
    {
      uid: '131412412412',
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

  const _renderPost = ({item}) => (
    <View style={styles.container}>
      <View style={styles.author}>
        <TouchableOpacity style={styles.profile}>
          <Image source={{uri: item._data.avatar_url}} style={styles.avatar} />
          <Text style={styles.name}>{item._data.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="more-vertical" size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={item._data.fileName} style={styles.image} />
      </View>
      <View style={styles.description}>
        <TouchableOpacity style={styles.love}>
          <Icon name="thumbs-up" size={16} color="red" />
          <Text style={styles.loveCount}>{item._data.love}</Text>
        </TouchableOpacity>
        <Text>12 juni 2020</Text>
      </View>
    </View>
  );

  const header = () => (
    <View style={[styles.author, styles.header]}>
      <TouchableOpacity style={styles.profile} onPress={gotoProfile}>
        <Image
          source={{uri: user && user.avatar_url}}
          style={[styles.avatar, styles.userAvatar]}
        />
        <Text style={[styles.name, styles.username]}>{user && user.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={gotoProfile}>
        <Icon name="settings" size={20} color={color.hitamAbu} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList
        stickyHeaderIndices={[0]}
        ListHeaderComponent={header}
        data={articles}
        ListEmptyComponent={() => <Text>Loading</Text>}
        renderItem={_renderPost}
        keyExtractor={(data) => data.id}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {},
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: 'grey',
  },
  username: {
    fontSize: 16,
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    height: 400,
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
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
