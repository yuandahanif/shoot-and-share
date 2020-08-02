import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import {color} from '../../styles/color';

export default function index({navigation}) {
  const slides = [
    {
      key: '1',
      title: 'Fotografi dan Seni Visual',
      text: 'Gabung bersama kami dan ekspresikan seni visualmu.',
      image: require('../../assets/images/undraw_camera_mg5h.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: '2',
      title: 'Temukan Jutaan Karya',
      text: 'Tunjukan dan Tampilkan karya terbaikmu bersama kami.',
      image: require('../../assets/images/undraw_the_search_s0xf.png'),
      backgroundColor: '#febe29',
    },
    {
      key: '3',
      title: 'Buat Galeri Senimu',
      text: 'Tunjukan dan Tampilkan karya terbaikmu bersama kami.',
      image: require('../../assets/images/undraw_online_gallery_dmv3.png'),
      backgroundColor: '#febe29',
    },
    {
      key: '4',
      title: 'Bagikan Karyamu',
      text: "Bagikan karyamu kepada dunia.",
      image: require('../../assets/images/undraw_Share_re_9kfx.png'),
      backgroundColor: '#22bcb5',
    },
  ];

  const _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  const onDone = () => {
    navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
  }
  
  const _renderDone = () => (
      <Text>Done</Text>
  )
  
  const _renderNext = () => (
      <Text>Next</Text>
  )
  const _renderPrev = () => (
      <Text>prev</Text>
  )
  const _renderPagination = () => (
      <Text>Pagination</Text>
  )
  const _renderSkip = () => (
      <Text>Skip</Text>
  )


  return (
    // <View style={styles.container}>
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={onDone}
      activeDotStyle={{backgroundColor: color.merahJambu}}
      renderNextButton={_renderNext}
      renderPrevButton={_renderPrev}
      renderDoneButton={_renderDone}
      renderSkipButton={_renderSkip}
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
});
