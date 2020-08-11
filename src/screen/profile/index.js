import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Logout} from '../../redux/actions/UserAction';
import {color} from '../../styles/color';

const Profile = ({navigation, user, LogoutFunc}) => {
  // const [user, setUser] = useState({});

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
    {
      uid: '13143424112',
      name: 'snowsant',
      avatar_url: require('../../assets/images/snowsant-profile.png'),
      image_url: require('../../assets/images/snowsant-profile.png'),
      like: 123,
    },
  ];

  // const getUserPost = () => {
  //   firestore().doc('articles').
  // }

  // useEffect(() => {
  // }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const logout = () => {
    LogoutFunc();
  };

  const _renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => deleteImage(item.uid)}
      style={styles.imageContainer}>
      <Image style={styles.image} source={item.image_url} />
    </TouchableOpacity>
  );

  const header = () => (
    <View style={styles.header}>
      <Image
        style={styles.imageProfile}
        source={{uri: user && user.avatar_url}}
      />
      <Text style={styles.name}>{user && user.name}</Text>
      <Text style={styles.quotesText}>
        "ini hanya dummy data. saat ini hanya tombol logout yang berfungsi."
      </Text>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const deleteImage = (uid) => {
    setModalVisible(true);
  };

  const confirmDelete = () => {
    // delete
  };

  const cancleDelete = () => setModalVisible(false);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 6,
              padding: 10,
              width: '80%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <Text style={{fontSize: 18}}>Hapus Foto ?</Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-around',
                width: '100%',
              }}>
              <Pressable onPress={confirmDelete}>
                <Icon name="check" size={34} />
              </Pressable>
              <Pressable onPress={cancleDelete}>
                <Icon name="slash" size={34} />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        renderItem={_renderItem}
        keyExtractor={(data) => data.uid}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={styles.header}
        horizontal={false}
        numColumns={3}
        columnWrapperStyle={{
          paddingLeft: (wp('100%') - wp(6) - wp('28%') * 3) / 2,
        }}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
});

const mapDispatchToProps = (dispatch) => {
  return {
    LogoutFunc: () => dispatch(Logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  flatList: {
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp('28%'),
    height: wp('28%'),
    margin: wp(1),
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
});
