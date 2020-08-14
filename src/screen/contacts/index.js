import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import Image from 'react-native-fast-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import database from '@react-native-firebase/database';
import TouchID from 'react-native-touch-id';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

import {SetContacts} from '../../redux/actions/UserAction';
import {color} from '../../styles/color';

const Contacts = ({navigation, user, SetContacts, contacts}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatID, setChatID] = useState(null);

  const getContactList = () => {
    SetContacts(user.id);
  };

  const deleteChat = () => {
    console.log(chatID);

    const config = {
      title: 'Konfirmasi untuk hapus.',
      imageColor: 'gray',
      imageErrorColor: 'red',
      sensorErrorDescription: 'maaf, sidik jari tidak dikenali.',
      cancelText: 'Batal',
    };

    TouchID.authenticate('Silahkan masukkan sidik jari anda.', config)
      .then((success) => {
        alert('Authenticated Successfully');
      })
      .catch((error) => {
        alert('Authentication Failed');
      });
  };
  const openModal = (id) => {
    setChatID(id);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setChatID(null);
    setIsModalVisible(false);
  };

  const goToChat = (id) => navigation.navigate('Chat', {reciverId: id});

  useEffect(() => {
    getContactList();
    return () => {
      const db = database().ref(`users/${user.id}`);
      if (db) {
        db.off();
      }
    };
  }, []);

  const _renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.contact}
      onLongPress={() => openModal(item.reciverId)}
      onPress={() => goToChat(item.reciverId)}>
      <Image
        source={{uri: item.avatar || null}}
        style={styles.avatar}
        resizeMode={Image.resizeMode.cover}
      />
      <View style={styles.desc}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.name}> </Text>
      </View>
      <Icon style={styles.more} name="more-vertical" size={hp(2)} />
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isFetching ? 'Sedang memuat history chat' : 'Belum ada chat'}
      </Text>
    </View>
  );

  const ChatModal = () => (
    <Modal
      isVisible={isModalVisible}
      onSwipeComplete={closeModal}
      swipeDirection={['down', 'up']}>
      <View style={styles.modal}>
        <Pressable style={styles.modalButton} onPress={() => deleteChat()}>
          <Text>Hapus</Text>
        </Pressable>
        <Pressable
          // eslint-disable-next-line react-native/no-inline-styles
          style={[styles.modalButton, {borderBottomWidth: 0}]}
          onPress={closeModal}>
          <Text>Tutup</Text>
        </Pressable>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ChatModal />
      <FlatList
        ListEmptyComponent={EmptyList}
        data={contacts}
        renderItem={_renderItem}
        keyExtractor={(data) => data._id.toString()}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
  contacts: state.UserContacts,
});

const mapDispatchToProps = (dispatch) => {
  return {
    SetContacts: (data) => dispatch(SetContacts(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp('50%'),
  },
  emptyText: {
    fontSize: hp(2),
    color: color.hitamText,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contact: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    // justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: color.abuPutih,
    borderBottomWidth: 1,
  },
  avatar: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(6),
    marginRight: 10,
  },
  desc: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  more: {
    marginLeft: 'auto',
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
});
