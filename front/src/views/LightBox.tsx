import { Pressable, StyleSheet, StatusBar, Image, Dimensions, View } from 'react-native';
import { UserScreen } from 'types';
import { Entypo } from '@expo/vector-icons';
import { useEffect } from 'react';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { dpw } from 'util/helpers';

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
  },
  x: {
    position: 'absolute',
    left: dpw(0.012),
    top: dpw(0.012),
    opacity: 1,
    zIndex: 1
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
      <Pressable style={styles.x} onPress={navigation.goBack}>
        <Entypo name="cross" size={dpw(0.11)} color="white" />
      </Pressable>
      <ReactNativeZoomableView maxZoom={10} minZoom={0.5}>
        <Image style={styles.singleImage} source={{ uri }} />
      </ReactNativeZoomableView>
    </View>
  );
};

export default LightBox;
