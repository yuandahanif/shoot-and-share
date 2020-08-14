import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Image from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Logout, SetUserArticles} from '../../redux/actions/UserAction';
import {color} from '../../styles/color';

const Profile = ({navigation, user, LogoutFunc, SetArticle, articles}) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      SetArticle(user.id);
    }
  }, [isFocused]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const logout = () => {
    LogoutFunc(user.id);
  };

  const ImageModal = () => (
    <Modal
      animationIn="zoomIn"
      animationOut="bounceInDown"
      animationOutTiming={300}
      isVisible={modalVisible}
      onBackdropPress={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.author}>
          <TouchableOpacity style={styles.profile}>
            <Image
              source={{uri: user.avatar_url}}
              style={styles.avatar}
              resizeMode={Image.resizeMode.cover}
            />
            <Text style={styles.modalName}>{user.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="x" size={16} onPress={() => closeModal()} />
          </TouchableOpacity>
        </View>
        <Image
          source={{uri: modalImage}}
          style={styles.modalImage}
          resizeMode="cover"
        />
      </View>
    </Modal>
  );

  const _renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => openModal(item.fileName || '')}
      style={styles.imageContainer}>
      <Image style={styles.image} source={{uri: item.fileName || ''}} />
    </TouchableOpacity>
  );

  const header = () => (
    <View style={styles.header}>
      <Image
        style={styles.imageProfile}
        source={{uri: user && user.avatar_url}}
      />
      <Text style={styles.name}>{user && user.name}</Text>
      <Text style={styles.quotesText}>"Selamat datang di profileku."</Text>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const openModal = (uri) => {
    setModalImage(uri);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ImageModal />
      <FlatList
        data={articles}
        renderItem={_renderItem}
        keyExtractor={(data) => data.id}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={styles.headerContainer}
        horizontal={false}
        numColumns={3}
        columnWrapperStyle={styles.columnWraper}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
  articles: state.UserArticles,
});

const mapDispatchToProps = (dispatch) => {
  return {
    LogoutFunc: () => dispatch(Logout()),
    SetArticle: (data) => dispatch(SetUserArticles(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  flatList: {
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  columnWraper: {
    // justifyContent: 'space-between',
    // marginRight: wp(1) ,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: color.hitamAbu,
    borderBottomWidth: 1,
  },
  header: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    paddingTop: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageProfile: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: 200,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 10,
    fontSize: 16,
  },
  quotesText: {
    color: color.hitamAbu,
    alignItems: 'center',
    textAlign: 'center',
    fontSize: hp(1.6),
    marginVertical: hp(1),
  },
  imageContainer: {
    width: wp('33%'),
    height: wp('33%'),
    // margin: wp(0.4),
    marginBottom: wp('1%') / 2,
    marginRight: wp('1%') / 2,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoutButton: {
    marginTop: hp(1.5),
    paddingVertical: hp(0.8),
    paddingHorizontal: hp(1.2),
    backgroundColor: color.biruAir,
    borderRadius: hp(0.2),
  },
  logoutText: {
    color: 'white',
  },

  // * Modal
  modalContainer: {
    width: wp('90%'),
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'white',
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
  modalName: {
    marginLeft: 10,
  },
  modalImage: {
    width: '100%',
    height: wp('90%'),
  },
});
