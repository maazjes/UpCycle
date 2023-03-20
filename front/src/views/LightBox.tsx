import Carousel from 'components/Carousel';
import { Pressable, StyleSheet, View, StatusBar } from 'react-native';
import { UserStackScreen } from 'types';
import { Entypo } from '@expo/vector-icons';
import { useEffect } from 'react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});

const LightBox = ({
  route,
  navigation
}: UserStackScreen<'LightBox'>): JSX.Element => {
  const { images, index } = route.params;

  const asd = false ? 'asd' : false ? 'true' : 'asd';
  if (!images) {
    navigation.goBack();
  }

  useEffect((): (() => void) => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    return (): void =>
      parent?.setOptions({
        tabBarStyle: { display: 'flex' }
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
      <Carousel zoomable images={images!} />
    </View>
  );
};

export default LightBox;
