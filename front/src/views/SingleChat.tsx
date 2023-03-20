import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TokenUser, TypedImage } from '@shared/types';
import { UserStackScreen } from 'types';
import { dpw, formatDate, pickImage } from 'util/helpers';
import MenuModal from 'components/MenuModal';
import { MediaTypeOptions } from 'expo-image-picker';
import useMessages from 'hooks/useMessages';
import Modal from 'components/Modal';
import ImageGrid from 'components/ImageGrid';
import TextInput from '../components/TextInput';
import socket from '../util/socket';
import { createMessage } from '../services/messages';
import { useAppSelector } from '../hooks/redux';
import Text from '../components/Text';
import Button from '../components/Button';

const styles = StyleSheet.create({
  addedImage: {
    width: '80%'
  },
  message: {
    backgroundColor: '#9BFF66',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    marginVertical: 3,
    maxWidth: '50%'
  },
  messageWithImage: {
    maxWidth: '80%'
  },
  messageRight: {
    position: 'absolute',
    backgroundColor: '#9BFF66',
    width: 25,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 0,
    right: -10,
    zIndex: -1
  },
  messageRightOverlap: {
    position: 'absolute',
    backgroundColor: '#fcf4ea',
    width: 20,
    height: 35,
    bottom: -2,
    borderBottomLeftRadius: 12,
    right: -20
  },
  messageLeft: {
    position: 'absolute',
    backgroundColor: '#9BFF66',
    width: 25,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 0,
    left: -10,
    zIndex: -1
  },
  messageLeftOverlap: {
    position: 'absolute',
    backgroundColor: '#fcf4ea',
    width: 20,
    height: 35,
    bottom: -2,
    borderBottomRightRadius: 12,
    left: -20
  },
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowRadius: 1.41,
    shadowOffset: {
      height: 1,
      width: 1
    },
    shadowOpacity: 0.2
  }
});

const SingleChat = ({
  route,
  navigation
}: UserStackScreen<'SingleChat'>): JSX.Element => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<TypedImage[]>([]);
  const [pickImageModalVisible, setPickImageModalVisible] = useState(false);
  const { userId } = route.params;
  const currentUser = useAppSelector((state): TokenUser => state.user!);
  const [messages, setMessages, fetchMessages] = useMessages({
    userId1: currentUser.id,
    userId2: userId
  });
  console.log(messages?.data);

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

  socket.on('message', (data): void => {
    console.log('asd');
    setMessages({
      ...data,
      senderId: currentUser.id,
      receiverId: userId
    });
  });

  const onNewMessage = async (): Promise<void> => {
    console.log('asd', message);
    const { data } = await createMessage({
      text: message,
      receiverId: userId,
      images
    });
    socket.emit('message', {
      text: message,
      receiverId: currentUser.id,
      createdAt: data.createdAt,
      images: data.images
    });
    setMessage('');
    setImages([]);
    setMessages(data);
  };

  const imagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    aspect: [1, 1] as [number, number],
    allowsMultipleSelection: true,
    quality: 1
  };

  const addImage = async (from: 'gallery' | 'camera'): Promise<void> => {
    setPickImageModalVisible(false);
    const pickedImages = await pickImage({
      ...imagePickerOptions,
      from
    });
    if (pickedImages) {
      setImages(images.concat(pickedImages));
    }
  };

  const menuModalItems = {
    Gallery: (): Promise<void> => addImage('gallery'),
    Camera: (): Promise<void> => addImage('camera')
  };

  const controls = (): JSX.Element => (
    <View style={{ marginTop: 2 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: '2%'
        }}
      >
        <View
          style={[
            {
              height: dpw(0.125),
              width: '85%'
            }
          ]}
        >
          <TextInput
            value={message}
            style={[
              {
                flex: 1,
                backgroundColor: 'white',
                borderWidth: 0,
                borderRadius: 15
              },
              styles.shadow
            ]}
            onChangeText={(value): void => setMessage(value)}
            error={false}
          />
          <View
            style={{
              position: 'absolute',
              right: 11,
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
              bottom: 0
            }}
          >
            <Pressable onPress={(): void => setPickImageModalVisible(true)}>
              <MaterialIcons
                name="add-photo-alternate"
                size={27}
                color="grey"
              />
            </Pressable>
          </View>
        </View>
        <Button
          circle
          onPress={onNewMessage}
          element={<Ionicons name="send" size={21} color="white" />}
        />
      </View>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: '#fcf4ea',
        flex: 1,
        paddingHorizontal: '2%'
      }}
    >
      {messages && (
        <FlatList
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          inverted
          data={messages.data}
          keyExtractor={({ id }): string => String(id)}
          renderItem={({ item }): JSX.Element => (
            <View
              style={[
                item.senderId === currentUser?.id
                  ? { alignSelf: 'flex-end' }
                  : { alignSelf: 'flex-start' },
                styles.message,
                item.images.length > 0 && styles.messageWithImage
              ]}
            >
              {item.images.length > 0 && <ImageGrid images={item.images} />}
              <Text>{item.text}</Text>
              <Text color="grey" style={{ fontSize: 13 }}>
                {formatDate(item.createdAt)}
              </Text>
              <View
                style={
                  item.senderId === currentUser.id
                    ? styles.messageRight
                    : styles.messageLeft
                }
              />
              <View
                style={
                  item.senderId === currentUser.id
                    ? styles.messageRightOverlap
                    : styles.messageLeftOverlap
                }
              />
            </View>
          )}
          onEndReached={fetchMessages}
          onEndReachedThreshold={0}
        />
      )}
      {controls()}
      <MenuModal
        items={menuModalItems}
        visible={pickImageModalVisible}
        onDismiss={(): void => setPickImageModalVisible(false)}
      />
      <Modal visible={images.length > 0} onDismiss={(): void => setImages([])}>
        {images.length > 0 ? (
          <View style={{ alignItems: 'center' }}>
            <Text
              weight="bold"
              style={{
                marginTop: 15,
                marginBottom: 10
              }}
              size="heading"
              align="center"
            >
              {images.length === 1
                ? 'Send image'
                : `Send ${images.length} images`}
            </Text>
            <Image
              source={{ uri: images[0].uri }}
              style={[
                styles.addedImage,
                { aspectRatio: images[0].height / images[0].width }
              ]}
            />
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '100%'
              }}
            >
              <TextInput
                style={{
                  borderWidth: 0,
                  fontSize: 18,
                  margin: 0,
                  paddingLeft: 0
                }}
                onChangeText={(value): void => setMessage(value)}
                error={false}
                placeholder="Add a caption..."
              />
              <Button
                size="small"
                fontSize={17}
                style={{}}
                text="SEND"
                onPress={(): void => {
                  setPickImageModalVisible(false);
                  onNewMessage();
                }}
              />
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
};

export default SingleChat;
