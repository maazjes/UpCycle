import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TypedImage } from '@shared/types';
import { ProfileProps, UserStackScreen } from 'types';
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
  container: {
    backgroundColor: '#fcf4ea',
    flex: 1
  },
  addedImage: {
    width: '80%'
  },
  message: {
    backgroundColor: '#9BFF66',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    marginRight: 5,
    marginVertical: 3,
    marginHorizontal: dpw(0.055 / 3),
    maxWidth: '50%'
  },
  messageWithImage: {
    maxWidth: '80%'
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#9BFF66',
    width: 25,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 0
  },
  bubbleRight: {
    right: -10
  },
  bubbleLeft: {
    left: -10
  },
  bubbleRightOverlap: {
    position: 'absolute',
    backgroundColor: '#fcf4ea',
    width: 20,
    height: 35,
    bottom: -2,
    borderBottomLeftRadius: 12,
    right: -20
  },
  bubbleLeftOverlap: {
    position: 'absolute',
    backgroundColor: '#fcf4ea',
    width: 20,
    height: 35,
    bottom: -2,
    borderBottomRightRadius: 12,
    left: -20
  },
  sendImageControls: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  sendImageText: {
    marginTop: 15,
    marginBottom: 10
  },
  sendImageInput: {
    borderWidth: 0,
    fontSize: 18,
    margin: 0,
    paddingLeft: 0
  },
  addPhotoIcon: {
    position: 'absolute',
    right: 11,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0
  },
  controls: {
    maxHeight: dpw(0.125),
    marginBottom: dpw(0.055 / 3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 'auto'
  },
  textInputContainer: {
    width: '82%'
  },
  textInput: {
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 15,
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

const imagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  aspect: [1, 1] as [number, number],
  allowsMultipleSelection: true,
  quality: 1
};

const SingleChat = ({ route, navigation }: UserStackScreen<'SingleChat'>): JSX.Element => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<TypedImage[]>([]);
  const [pickImageModalVisible, setPickImageModalVisible] = useState(false);
  const { userId } = route.params;
  const { id: currentUserId } = useAppSelector((state): ProfileProps => state.profileProps!);
  const [messages, setMessages, fetchMessages] = useMessages({
    userId1: currentUserId,
    userId2: userId
  });

  useEffect((): (() => void) => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    socket.on('message', (data): void => {
      setMessages({
        ...data,
        senderId: currentUserId,
        receiverId: userId
      });
    });

    return (): void =>
      parent?.setOptions({
        tabBarStyle: { display: 'flex' }
      });
  }, []);

  const onNewMessage = async (): Promise<void> => {
    const { data } = await createMessage({
      text: message,
      receiverId: userId,
      images
    });
    socket.emit('message', {
      text: message,
      receiverId: currentUserId,
      createdAt: data.createdAt,
      images: data.images
    });
    setMessage('');
    setImages([]);
    setMessages(data);
  };

  const addImage = async (from: 'gallery' | 'camera'): Promise<void> => {
    const pickedImages = await pickImage({
      ...imagePickerOptions,
      from
    });
    setPickImageModalVisible(false);
    if (pickedImages) {
      setImages(images.concat(pickedImages));
    }
  };

  const menuModalItems = {
    Gallery: (): Promise<void> => addImage('gallery'),
    Camera: (): Promise<void> => addImage('camera')
  };

  const controls = (): JSX.Element => (
    <View style={styles.controls}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={message}
          style={styles.textInput}
          onChangeText={(value): void => setMessage(value)}
          error={false}
        />
        <View style={styles.addPhotoIcon}>
          <Pressable onPress={(): void => setPickImageModalVisible(true)}>
            <MaterialIcons name="add-photo-alternate" size={dpw(0.09)} color="grey" />
          </Pressable>
        </View>
      </View>
      <Button
        style={{ marginTop: 1 }}
        circle
        onPress={onNewMessage}
        element={<Ionicons name="send" size={dpw(0.06)} color="white" />}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {messages && (
        <FlatList
          contentContainerStyle={{ padding: dpw(0.055 / 3) }}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          inverted
          data={messages.data}
          keyExtractor={({ id }): string => String(id)}
          renderItem={({ item }): JSX.Element => (
            <View
              style={[
                item.senderId === currentUserId
                  ? { alignSelf: 'flex-end' }
                  : { alignSelf: 'flex-start' },
                styles.message,
                item.images.length > 0 && styles.messageWithImage
              ]}
            >
              {item.images.length > 0 && <ImageGrid images={item.images} />}
              {item.text ? <Text>{item.text}</Text> : <View style={{ marginTop: 5 }} />}
              <View
                style={[
                  styles.bubble,
                  item.senderId === currentUserId ? styles.bubbleRight : styles.bubbleLeft
                ]}
              />
              <View
                style={
                  item.senderId === currentUserId
                    ? styles.bubbleRightOverlap
                    : styles.bubbleLeftOverlap
                }
              />
              <Text color="grey" style={{ fontSize: 13 }}>
                {formatDate(item.createdAt)}
              </Text>
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
        {images.length > 0 && (
          <View style={{ alignItems: 'center' }}>
            <Text weight="bold" style={styles.sendImageText} size="heading" align="center">
              {images.length === 1 ? 'Send image' : `Send ${images.length} images`}
            </Text>
            <Image
              source={{ uri: images[0].uri }}
              style={[styles.addedImage, { aspectRatio: images[0].height / images[0].width }]}
            />
            <View style={styles.sendImageControls}>
              <TextInput
                style={styles.sendImageInput}
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
        )}
      </Modal>
    </View>
  );
};

export default SingleChat;
