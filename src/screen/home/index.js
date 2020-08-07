import React, {useEffect, useContext, useState, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {color} from '../../styles/color';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {RootContext} from '../../contexts';
import Image from 'react-native-fast-image';

export default ({navigation}) => {
  const {user} = useContext(RootContext);
  const [articles, setArticles] = useState([]);
  const [lastArticleIndex, setLastArticleIndex] = useState(null);
  const isMounted = useRef(false);

  const articleRef = firestore()
    .collection('articles')
    .orderBy('createdAt', 'desc')
    .limit(30);

  // FIXME: done.
  const firstArticle = () => {
    articleRef.get().then(async (documents) => {
      let temp = [];
      await Promise.all(
        documents.docs.map(async (doc) => {
          const data = doc.data();
          const res = await data.author.get();
          const author = await res.data();
          const fileName = await storage().ref(data.fileName).getDownloadURL();
          temp.push({...data, author, fileName});
          // Promise.resolve(temp);
        }),
      )
        .then(() => {
          if (!isMounted.current) {
            setArticles(temp);
            setLastArticleIndex(temp ? temp[temp.length - 1].createdAt : null);
          }
        })
        .catch((err) => {
          console.log('firstArticle -> err', err);
        });
    });
  };

  const nextArticles = () => {
    console.log('hi refreshing', articles[0]);
    // articleRef
    //   .startAfter(lastArticleIndex)
    //   .get()
    //   .then((documents) => {
    //     let articles = [];
    //     documents.forEach((doc) => {
    //       articles.push(doc.data());
    //     });
    //     setArticles(articles);
    //     setLastArticleIndex(articles[articles.length - 1].createdAt);
    //   });
  };

  useEffect(() => {
    firstArticle();
    return () => {
      isMounted.current = true;
    };
  }, []);

  const gotoProfile = () => navigation.navigate('profile');

  // * Article
  const ImageArticle = ({uri}) => (
    <View style={styles.imageContainer}>
      <Image
        source={{uri: uri || null}}
        style={styles.image}
        resizeMode={Image.resizeMode.cover}
      />
    </View>
  );

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

  const _renderPost = ({item}) => (
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
          <Icon name="more-vertical" size={16} />
        </TouchableOpacity>
      </View>
      <ImageArticle uri={item.fileName} />
      <View style={styles.description}>
        <TouchableOpacity style={styles.love}>
          <Icon name="thumbs-up" size={16} color="red" />
          <Text style={styles.loveCount}>{item.love}</Text>
        </TouchableOpacity>
        <Text>{dateConvert(item.createdAt._seconds)}</Text>
      </View>
    </View>
  );

  const header = () => (
    <View style={[styles.author, styles.header]}>
      <TouchableOpacity style={styles.profile} onPress={gotoProfile}>
        <Image
          source={{uri: user && user.avatar_url}}
          style={[styles.avatar, styles.userAvatar]}
          resizeMode={Image.resizeMode.cover}
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
        onEndReached={nextArticles}
        onEndReachedThreshold={0.2}
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
