import React, {useEffect, useContext, useState, useRef} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Image from 'react-native-fast-image';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

// * Components
import _renderItemArticle from '../../components/_renderItemArticle';
import _headerArticles from '../../components/_headerArticles';

import {color} from '../../styles/color';

const Home = ({navigation, route, user, Article}) => {
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

  useEffect(() => {
    firstArticle();
    return () => {
      isMounted.current = true;
    };
  }, []);

  // * Article screen

  const SkeletonRenderItem = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Sedang memuat konten.</Text>
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
        ListHeaderComponent={() =>
          _headerArticles({user, navigation, progress: Article.upload})
        }
        data={articles}
        // TODO: skeleton loader . . .
        ListEmptyComponent={SkeletonRenderItem}
        renderItem={({item}) => _renderItemArticle({item, openModal})}
        keyExtractor={(data) => data.id}
        contentContainerStyle={styles.flatList}
        ListHeaderComponentStyle={styles.header}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
  Article: state.Article,
});

// const mapDispatchToProps = (dispatch) => {
// return {
// : () => dispatch(),
// };
// };

export default connect(mapStateToProps, null)(Home);

const styles = StyleSheet.create({
  flatList: {},
  header: {marginBottom: hp(2)},
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
