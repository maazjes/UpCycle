import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, Keyboard, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TypedImage } from '@shared/types';
import { UserScreen } from 'types';
import { dpw, formatDate, pickImage } from 'util/helpers';
import MenuModal from 'components/MenuModal';
import { MediaTypeOptions } from 'expo-image-picker';
import useMessages from 'hooks/useMessages';
import ImageGrid from 'components/ImageGrid';
import { getChat } from 'services/chats';
import { addChat, editChat } from 'reducers/chats';
import Modal from 'components/Modal';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import TextInput from '../components/TextInput';
import socket from '../util/socket';
import { createMessage } from '../services/messages';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Text from '../components/Text';
import Button from '../components/Button';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcf4ea'
  },
  addedImage: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    resizeMode: 'contain',
    flex: 1
  },
  message: {
    backgroundColor: '#9BFF66',
    padding: dpw(0.02),
    borderRadius: dpw(0.01),
    marginVertical: dpw(0.008),
    marginHorizontal: dpw(0.05 / 3),
    maxWidth: '50%'
  },
  messageWithImage: {
    maxWidth: '80%'
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#9BFF66',
    width: dpw(0.04),
    height: dpw(0.04),
    bottom: 0
  },
  bubbleRight: {
    right: -dpw(0.012)
  },
  bubbleLeft: {
    left: -dpw(0.01)
  },
  bubbleOverlap: {
    position: 'absolute',
    backgroundColor: '#fcf4ea',
    width: dpw(0.05),
    height: dpw(0.1),
    bottom: 0
  },
  bubbleRightOverlap: {
    borderBottomLeftRadius: dpw(0.03),
    right: -dpw(0.05)
  },
  bubbleLeftOverlap: {
    borderBottomRightRadius: dpw(0.03),
    left: -dpw(0.05)
  },
  sendImageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%'
  },
  sendImageInput: {
    borderWidth: 0,
    fontSize: dpw(0.052),
    paddingLeft: 0,
    backgroundColor: 'white',
    height: dpw(0.1),
    flex: 1,
    maxWidth: '60%'
  },
  addPhotoIcon: {
    position: 'absolute',
    right: dpw(0.025),
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
    borderRadius: dpw(0.1),
    elevation: 2,
    shadowColor: '#000',
    shadowRadius: 1.41,
    shadowOffset: {
      height: 1,
      width: 1
    },
    shadowOpacity: 0.2
  },
  sendImageModal: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: dpw(0.01)
  },
  imageToSend: {
    width: windowWidth * 0.8,
    maxHeight: '70%',
    marginVertical: dpw(0.01)
  },
  hitSlop: {
    top: dpw(0.015),
    bottom: dpw(0.015),
    left: dpw(0.015),
    right: dpw(0.015)
  }
});

const imagePickerOptions = {
  mediaTypes: MediaTypeOptions.Images,
  aspect: [1, 1] as [number, number],
  allowsMultipleSelection: true,
  quality: 1
};

const SingleChat = ({ route, navigation }: UserScreen<'SingleChat'>): JSX.Element => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<TypedImage[]>([]);
  const [pickImageModalVisible, setPickImageModalVisible] = useState(false);
  const currentUserId = useAppSelector((state): string => state.currentUserId!);
  const { userId, username } = route.params;
  const [messages, addMessage, fetchMessages] = useMessages({
    userId1: currentUserId,
    userId2: userId
  });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [imageModalLoading, setImageModalLoading] = useState(false);
  const aspectRatio = useRef<number>();

  useEffect((): void => {
    navigation.setOptions({ title: username });
  }, []);

  useEffect((): (() => void) => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    socket.on('message', (newMessage): void => {
      addMessage({
        ...newMessage,
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
    if (images.length === 0) {
      setLoading(true);
    } else {
      setImageModalLoading(true);
    }
    try {
      const { data } = await createMessage({
        text: message,
        receiverId: userId,
        images: images.map((image): string => image.uri)
      });
      socket.emit('message', {
        text: message,
        receiverId: currentUserId,
        createdAt: data.createdAt,
        images: data.images
      });
      if (messages!.data.length === 0) {
        const res = await getChat(data.chatId);
        dispatch(addChat(res.data));
      } else {
        dispatch(editChat({ id: messages!.data[0].chatId!, lastMessage: data }));
      }
      setMessage('');
      setImages([]);
      addMessage(data);
    } catch {}
    setLoading(false);
    setImageModalLoading(false);
  };

  const closeSendImageModal = (): void => {
    setImages([]);
    aspectRatio.current = undefined;
  };

  const closePickImageModal = (): void => {
    setPickImageModalVisible(false);
  };

  const openPickImageModal = (): void => {
    setPickImageModalVisible(true);
  };

  const addImage = async (from: 'gallery' | 'camera'): Promise<void> => {
    const pickedImages = await pickImage({
      ...imagePickerOptions,
      from
    });
    if (pickedImages) {
      await Image.getSize(pickedImages[0].uri, (w, h): void => {
        aspectRatio.current = w / h;
        setImages(images.concat(pickedImages));
      });
    }
    closePickImageModal();
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
          returnKeyType="send"
          onSubmitEditing={onNewMessage}
        />

        <View style={styles.addPhotoIcon}>
          <Pressable hitSlop={styles.hitSlop} onPress={openPickImageModal}>
            <MaterialIcons name="add-photo-alternate" size={dpw(0.08)} color="grey" />
          </Pressable>
        </View>
      </View>
      <Button
        loading={loading}
        style={{ marginTop: 1 }}
        circle
        onPress={onNewMessage}
        element={<Ionicons name="send" size={dpw(0.06)} color="white" />}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView enabled={images.length === 0} style={styles.container}>
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
                <View style={{ paddingTop: dpw(0.01) }} />
                {item.text && <Text>{item.text}</Text>}
                <View
                  style={[
                    styles.bubble,
                    item.senderId === currentUserId ? styles.bubbleRight : styles.bubbleLeft
                  ]}
                />
                <View
                  style={[
                    styles.bubbleOverlap,
                    item.senderId === currentUserId
                      ? styles.bubbleRightOverlap
                      : styles.bubbleLeftOverlap
                  ]}
                />
                <Text color="grey" style={{ fontSize: dpw(0.037) }}>
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
          onDismiss={closePickImageModal}
        />
      </KeyboardAvoidingView>
      {images.length > 0 && (
        <Modal
          avoidKeyboard
          onPress={Keyboard.dismiss}
          innerContainerStyle={styles.sendImageModal}
          visible={images.length > 0}
          onDismiss={closeSendImageModal}
        >
          <Text size="heading" weight="bold">
            {images.length === 1 ? 'Send image' : `Send ${images.length} images`}
          </Text>
          <Image
            style={[styles.imageToSend, { aspectRatio: aspectRatio.current }]}
            source={{ uri: images[0].uri }}
          />
          <View style={styles.sendImageControls}>
            <TextInput
              placeholderTextColor="black"
              style={styles.sendImageInput}
              onChangeText={(value): void => setMessage(value)}
              error={false}
              blurOnSubmit={false}
              returnKeyType="send"
              onSubmitEditing={onNewMessage}
              placeholder="Add a caption..."
            />
            <Button text="SEND" size="small" loading={imageModalLoading} onPress={onNewMessage} />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default SingleChat;
