import React, {useRef, useEffect, useState, useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {connect} from 'react-redux';

import {UploadArticles} from '../../redux/actions/ArticleAction';

const Add = ({navigation, user, Upload}) => {
  const camera = useRef();
  const [photo, setPhoto] = useState({});
  const [type, setType] = useState('back');
  const [uploadPromt, setUploadPromt] = useState(false);
  //   for performance
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const goBack = () => {
    navigation.goBack();
  };

  const toggleCameraType = () => {
    setType((prevState) => {
      return prevState === 'back' ? 'front' : 'back';
    });
  };

  const takePicture = async () => {
    const options = {
      quality: 0.5,
      base64: true,
      pauseAfterCapture: true,
      exif: true,
    };
    const data = await camera.current.takePictureAsync(options);
    setPhoto(data);
    setUploadPromt(true);
  };

  const UploadView = () => (
    <View style={styles.uploadContainer}>
      <Text style={styles.uploadText}>Unggah Foto Ini ?</Text>
      <View style={styles.uploadButton}>
        <TouchableOpacity onPress={uploadImage}>
          <Icon name="check" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={cancleUpload}>
          <Icon name="slash" size={34} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const uploadImage = () => {
    setUploadPromt(false);
    camera.current.resumePreview();
    uploadtoFirebase();
  };

  const cancleUpload = () => {
    setUploadPromt(false);
    camera.current.resumePreview();
  };

  const CameraButton = () => (
    <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
      <Icon name="camera" size={40} color="white" />
    </TouchableOpacity>
  );

  const uploadtoFirebase = () => {
    Upload(user.id, photo.uri);
    // const timestamp = new Date().getTime();
    // const fileName = `${user.id}-${timestamp}`;
    // const upload = storage()
    //   .ref(`/articles/images/${fileName}`)
    //   .putFile(photo.uri, {cacheControl: 'public, max-age=3600'});
    // upload.then((snapshot) => {
    //   const serverTimestamp = firestore.FieldValue.serverTimestamp();
    //   const articleRef = firestore().collection('articles');
    //   const userRef = firestore().collection('users');

    //   articleRef
    //     .doc(fileName)
    //     .set({
    //       id: fileName,
    //       author: userRef.doc(user.id),
    //       fileName: snapshot.metadata.fullPath,
    //       createdAt: serverTimestamp,
    //       love: 0,
    //     })
    //     .then(() => {
    //       alert('upload success!');
    //     });
    // });

    // upload.on('state_changed', (progress) => {
    //   console.log(
    //     `transfer data ${progress.bytesTransferred} dari ${progress.totalBytes}`,
    //   );
    // });

    // upload.catch((err) => {
    //   console.log('error upload photo -> ', err);
    // });
  };

  return (
    <View style={styles.container}>
      {isFocused ? (
        <RNCamera ref={camera} type={type} style={styles.camera}>
          <View style={styles.cameraTop}>
            <TouchableOpacity onPress={goBack}>
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraType}>
              <Icon name="rotate-cw" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {uploadPromt ? <UploadView /> : <CameraButton />}
        </RNCamera>
      ) : null}
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.User,
});

const mapDispatchToProps = (dispatch) => {
  return {
    Upload: (...data) => dispatch(UploadArticles(...data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraTop: {
    padding: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cameraButton: {
    marginBottom: 40,
  },
  uploadContainer: {
    width: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    padding: 10,
    paddingBottom: 50,
    alignItems: 'stretch',
  },
  uploadText: {
    alignSelf: 'center',
    color: 'white',
    marginBottom: 10,
    fontSize: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
