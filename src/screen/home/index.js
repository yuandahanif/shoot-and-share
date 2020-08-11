import React, {useEffect, useContext, useState, useRef} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Image from 'react-native-fast-image';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import {color} from '../../styles/color';

const Home = ({navigation, route, user}) => {
  // const [user, setUser] = useState(User);
  const isMounted = useRef(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState([]);
  const [lastArticleIndex, setLastArticleIndex] = useState(null);
  const [articleLimit, setArticleLimit] = useState(3);

  const articleRef = firestore()
    .collection('articles')
    .orderBy('createdAt', 'desc')
    .limit(articleLimit);

  const getUser = () => {
    if (true) {
      const uid = auth().currentUser.uid;
      firestore()
        .doc(`users/${uid}`)
        .get()
        .then((data) => {
          const user = data.data();
          setUser(user);
        });
    }
  };

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
            setArticleLimit(5);
            setArticles(temp);
            setLastArticleIndex(
              documents.docs[documents.docs.length - 1] || null,
            );
            isMounted.current = true;
          }
        })
        .catch((err) => {
          console.log('firstArticle -> err', err);
        });
    });
  };

  const nextArticles = () => {
    articleRef
      .startAfter(lastArticleIndex)
      .get()
      .then(async (documents) => {
        let temp = [];
        await Promise.all(
          documents.docs.map(async (doc) => {
            const data = doc.data();
            const res = await data.author.get();
            const author = await res.data();
            const fileName = await storage()
              .ref(data.fileName)
              .getDownloadURL();
            temp.push({...data, author, fileName});
          }),
        )
          .then(() => {
            const newArticles = [...articles, ...temp];
            setArticles(newArticles);
            setLastArticleIndex(
              documents.docs[documents.docs.length - 1] || null,
            );
          })
          .catch((err) => {
            console.log('nextArticles -> err', err);
          });
      });
  };

  const refreshArticle = () => {
    isMounted.current = false;
    setArticles([]);
    firstArticle();
  };

  // * Modal
  const openModal = (id) => {
    setProfileId(id);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setProfileId(null);
    setIsModalVisible(false);
  };

  // * Navigation
  const gotoChat = (id) => {
    closeModal();
    navigation.navigate('Chat', {reciverId: id});
  };

  const gotoProfile = () => navigation.navigate('profile');

  const gotoChatList = () => navigation.navigate('ChatList', {id: user.id});

  useEffect(() => {
    firstArticle();
    // getUser();
    return () => {
      isMounted.current = true;
    };
  }, []);

  // * Article screen
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
          <Icon
            name="more-vertical"
            size={16}
            onPress={() => openModal(item.author.id)}
          />
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

  const SkeletonRenderItem = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Sedang memuat konten.</Text>
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
      <TouchableOpacity onPress={gotoChatList}>
        <Icon name="message-square" size={20} color={color.hitamAbu} />
      </TouchableOpacity>
    </View>
  );

  const MoreModal = () => (
    <Modal
      isVisible={isModalVisible}
      onSwipeComplete={closeModal}
      swipeDirection={['down', 'up']}>
      <View style={styles.modal}>
        <Pressable
          style={styles.modalButton}
          onPress={() => console.log('profile -> ', profileId)}>
          <Text>Profile</Text>
        </Pressable>
        {/* ! Hide If Current User */}
        {profileId === (user && user.id) ? null : (
          <Pressable
            style={styles.modalButton}
            options={{tabBarVisible: false}}
            onPress={() => gotoChat(profileId)}>
            <Text>Chat</Text>
          </Pressable>
        )}
        {/* Change if current user */}
        {profileId === (user && user.id) ? (
          <Pressable
            style={styles.modalButton}
            onPress={() => console.log('Laporkan', profileId)}>
            <Text>Pengaturan</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.modalButton}
            onPress={() => console.log('Laporkan', profileId)}>
            <Text>Laporkan</Text>
          </Pressable>
        )}
        <Pressable
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.modalButton, {borderBottomWidth: 0}]}
          onPress={() => {
            closeModal();
            console.log(profileId);
          }}>
          <Text>Tutup</Text>
        </Pressable>
      </View>
    </Modal>
  );

  return (
    <View style={{flex: 1}}>
      <MoreModal />
      <FlatList
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={() => {
          refreshArticle();
        }}
        onEndReached={nextArticles}
        onEndReachedThreshold={0.5}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={header}
        data={articles}
        // TODO: skeleton loader . . .
        ListEmptyComponent={SkeletonRenderItem}
        renderItem={_renderPost}
        keyExtractor={(data) => data.id}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
});

// const mapDispatchToProps = (dispatch) => {
// return {
// : () => dispatch(),
// };
// };

export default connect(mapStateToProps, null)(Home);

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
  // * Modal
  modal: {
    backgroundColor: 'white',
    // padding: 22,
    justifyContent: 'center',
    alignItems: 'stretch',
    borderRadius: 6,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    // alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomColor: color.abuPutih,
    borderBottomWidth: 1,
  },
  // Empty list
  emptyContainer: {
    flex: 1,
    marginTop: hp('50%'),
    marginLeft: wp('50%'),
    justifyContent: 'center',
    alignContent: 'center',
  },
  emptyText: {
    color: color.hitamText,
    fontSize: hp(2),
    transform: [{translateX: -wp(25)}],
  },
});
