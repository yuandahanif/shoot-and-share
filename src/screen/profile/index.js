import React,{ useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Modal, Pressable} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

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

  const [modalVisible, setModalVisible] = useState(false)

  const _renderItem = ({item}) => (
    <TouchableOpacity onPress={ () => deleteImage(item.uid)} style={styles.imageContainer}>
      <Image style={styles.image} source={item.image_url} />
    </TouchableOpacity>
  );

  const header = () => (
    <View style={styles.header}>
      <Image
        style={styles.imageProfile}
        source={require('../../assets/images/snowsant-profile.png')}
      />
      <Text style={styles.name}>Yuanda</Text>
    </View>
  );

  const deleteImage = (uid) => {
      setModalVisible(true);
  }

  const confirmDelete = () => {// delete
}

  const cancleDelete = () => setModalVisible(false);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
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
          marginLeft: (DEVICE.width - (DEVICE.width / 3 - 50 / 3) * 3) / 3,
        }}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
}

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
    width: DEVICE.width / 4 - 20,
    height: DEVICE.width / 4 - 20,
    borderRadius: 200,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 10,
    fontSize: 16,
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
