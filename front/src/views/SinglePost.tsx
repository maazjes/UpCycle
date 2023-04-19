import { StyleSheet, Dimensions, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import MenuModal from 'components/MenuModal';
import { Entypo } from '@expo/vector-icons';
import { removePost } from 'reducers/profilePosts';
import { setSinglePost } from 'reducers/singlePost';
import { dpw } from 'util/helpers';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import SinglePostCard from '../components/SinglePostCard';
import { GlobalState, UserScreen } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Button from '../components/Button';
import { deletePost, getPost } from '../services/posts';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenWidth
  },
  container: {
    justifyContent: 'center'
  },
  userBar: {
    paddingHorizontal: dpw(0.04),
    paddingVertical: '3%'
  },
  hitSlop: {
    top: dpw(0.05),
    bottom: dpw(0.05),
    right: dpw(0.025),
    left: dpw(0.025)
  }
});

const SinglePost = ({ route, navigation }: UserScreen<'SinglePost'>): JSX.Element => {
  const { postId } = route.params;
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { currentUserId, singlePost } = useAppSelector((state): GlobalState => state);
  const dispatch = useAppDispatch();

  useEffect((): (() => void) => {
    const initialize = async (): Promise<void> => {
      try {
        const res = await getPost(postId);
        dispatch(setSinglePost(res.data));
      } catch {}
    };

    initialize();

    return (): void => {
      setSinglePost(null);
    };
  }, []);

  if (!singlePost || singlePost.id !== postId) {
    return <Loading />;
  }

  const openSettingsModal = (): void => {
    setSettingsModalVisible(true);
  };

  const closeSettingsModal = (): void => {
    setSettingsModalVisible(false);
  };

  const onMessage = (): void => {
    navigation.navigate('SingleChat', {
      userId: singlePost.user.id,
      username: singlePost.user.username
    });
  };

  const onPostDelete = async (id: number): Promise<void> => {
    try {
      await deletePost(id);
      dispatch(removePost(id));
      navigation.goBack();
      closeSettingsModal();
    } catch {}
  };

  const onPostEdit = (): void => {
    navigation.navigate('EditPost', singlePost);
    closeSettingsModal();
  };

  const menuModalItems = {
    'Delete post': (): Promise<void> => onPostDelete(postId),
    'Edit post': onPostEdit
  };

  const itemRight =
    currentUserId === singlePost.user.id ? (
      <Pressable onPress={openSettingsModal} hitSlop={styles.hitSlop}>
        <Entypo style={{ marginTop: 1 }} name="dots-three-horizontal" size={21} color="black" />
      </Pressable>
    ) : (
      <Button onPress={onMessage} size="small" text="Message" />
    );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <UserBar style={styles.userBar} user={singlePost.user} itemRight={itemRight} />
      <SinglePostCard post={singlePost} containerStyle={styles.container} />
      <MenuModal
        items={menuModalItems}
        visible={settingsModalVisible}
        onDismiss={closeSettingsModal}
      />
    </ScrollView>
  );
};

export default SinglePost;
