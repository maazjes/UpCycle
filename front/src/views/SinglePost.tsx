import {
  StyleSheet, Dimensions, ScrollView, Pressable, Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { TokenUser, Post } from '@shared/types';
import MenuModal from 'components/MenuModal';
import { Entypo } from '@expo/vector-icons';
import useNotification from 'hooks/useNotification';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import SinglePostCard from '../components/SinglePostCard';
import { UserStackScreen } from '../types';
import { useAppSelector } from '../hooks/redux';
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
    paddingHorizontal: '5%',
    paddingVertical: '3%'
  }
});

const SinglePost = ({ route, navigation }:
UserStackScreen<'SinglePost'>): JSX.Element => {
  const { postId } = route.params;
  const [post, setPost] = useState<null | Post>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const currentUser = useAppSelector((state): TokenUser => state.user!);
  const notification = useNotification();
  const { navigate } = navigation;

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getPost(postId);
      setPost(res.data);
    };
    initialize();
  }, []);

  if (!post) {
    return <Loading />;
  }

  const onUserBarPress = (): void => {
    navigate('StackProfile', { userId: post.user.id, username: post.user.username });
  };

  const onMessage = (): void => {
    navigate('SingleChat', { userId: post.user.id });
  };

  const onPostDelete = async (id: number): Promise<void> => {
    try {
      await deletePost(id);
    } catch (e) {

    }
    setModalVisible(false);
  };

  const createTwoButtonAlert = () => Alert.alert('Alert Title', 'My Alert Msg', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel'
    }
  ]);

  const onPostEdit = (id: number): void => {
    navigate('EditPost', { postId: id });
    setModalVisible(false);
  };

  const menuModalItems = {
    'Delete post': (): Promise<void> => onPostDelete(postId),
    'Edit post': (): void => onPostEdit(postId)
  };

  const itemRight = currentUser.id === post.user.id
    ? (
      <Pressable onPress={(): void => setModalVisible(true)}>
        <Entypo style={{ marginTop: 1 }} name="dots-three-horizontal" size={21} color="black" />
      </Pressable>
    )
    : <Button onPress={onMessage} size="small" text="Message" />;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <UserBar
        style={styles.userBar}
        onPress={onUserBarPress}
        user={post.user}
        itemRight={itemRight}
      />
      <SinglePostCard
        post={post}
        containerStyle={styles.container}
      />
      <MenuModal
        items={menuModalItems}
        visible={modalVisible}
        onDismiss={(): void => setModalVisible(false)}
      />
    </ScrollView>
  );
};

export default SinglePost;
