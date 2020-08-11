import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import {color} from '../../styles/color';

export default function index({navigation}) {
  const slides = [
    {
      key: '1',
      title: 'Fotografi dan Seni Visual',
      text: 'Gabung bersama kami \ndan ekspresikan seni visualmu.',
      image: require('../../assets/images/undraw_camera_mg5h.png'),
    },
    {
      key: '2',
      title: 'Temukan Jutaan Karya',
      text: 'Cari dan temukan mahakarya \ndari seluruh Dunia.',
      image: require('../../assets/images/undraw_the_search_s0xf.png'),
    },
    {
      key: '3',
      title: 'Buat Galeri Senimu',
      text: 'Tunjukan dan Tampilkan karya terbaikmu \nbersama kami.',
      image: require('../../assets/images/undraw_online_gallery_dmv3.png'),
    },
    {
      key: '4',
      title: 'Bagikan Karyamu',
      text: 'Bagikan karyamu kepada dunia.',
      image: require('../../assets/images/undraw_Share_re_9kfx.png'),
    },
  ];

  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'login'}],
    });
  };

  const _renderDone = () => (
    <View style={styles.squereButton}>
      <Text style={styles.buttonText}>Lewati</Text>
    </View>
  );
  const _renderNext = () => (
    <View style={styles.squereButton}>
      <Text style={styles.buttonText}>Berikutnya</Text>
    </View>
  );
  const _renderSkip = () => (
    <View style={styles.squereButton}>
      <Text style={styles.buttonText}>Lewati</Text>
    </View>
  );

  return (
    // <View style={styles.container}>
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={onDone}
      activeDotStyle={{backgroundColor: 'cyan'}}
      renderNextButton={_renderNext}
      renderDoneButton={_renderDone}
      renderSkipButton={_renderSkip}
      onSkip={onDone}
      showSkipButton={true}
    />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: color.hitamText,
    marginTop: 50,
  },
  image: {
    flex: 1,
    resizeMode: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: color.hitamText,
  },
  squereButton: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: color.hitamAbu,
  },
});
