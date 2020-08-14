import React, {useEffect, useContext, useState, useRef} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
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
import {GetArticles, UpdateArticles} from '../../redux/actions/ArticleAction';

const Home = ({
  navigation,
  user,
  articleGlobalState,
  getArticles,
  updateArticles,
}) => {
  const {articles, upload, limit, lastArticle} = articleGlobalState;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [profileId, setProfileId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Bind Globall state
  // const [articles, setArticles] = useState(articlesState);
  // const [lastArticleIndex, setLastArticleIndex] = useState(null);

  const firstArticle = () => {
    getArticles();
  };
// FIXME: bug disini. ada duplikat key juka me refresh terlalu banyak.
  const nextArticles = () => {
    updateArticles(lastArticle, limit);
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

  // ********* Use Effect
  useEffect(() => {
    firstArticle();
  }, []);

  useEffect(() => {}, [articleGlobalState.progress]);
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
        onRefresh={firstArticle}
        onEndReached={nextArticles}
        onEndReachedThreshold={0.5}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() =>
          _headerArticles({user, navigation, progress: upload})
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
  articleGlobalState: state.Article,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getArticles: () => dispatch(GetArticles()),
    updateArticles: (...data) => dispatch(UpdateArticles(...data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

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
