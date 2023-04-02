import { Pressable, StyleSheet, View, StatusBar, Image, Dimensions } from 'react-native';
import { UserScreen } from 'types';
import { Entypo } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  singleImage: {
    width: windowWidth,
    height: windowWidth
  }
});

const LightBox = ({ route, navigation }: UserScreen<'LightBox'>): JSX.Element => {
  const { uri } = route.params;

  useEffect((): void => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Pressable
        style={{
          position: 'absolute',
          left: 5,
          top: 5,
          opacity: 1,
          zIndex: 1
        }}
        onPress={navigation.goBack}
      >
        <Entypo name="cross" size={40} color="white" />
      </Pressable>
      <ReactNativeZoomableView maxZoom={30} contentWidth={300} contentHeight={150}>
        <Image style={styles.singleImage} source={{ uri }} />
      </ReactNativeZoomableView>
    </View>
  );
};

export default LightBox;
