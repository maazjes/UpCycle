import * as React from 'react';
import { Pressable, View, Alert } from 'react-native';
import { Menu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PostBase, UserStackNavigation } from '../../types';
import useNotification from '../../hooks/useNotification';
import useError from '../../hooks/useError';
import postsService from '../../services/posts';

const PostOptions = ({ post }: { post: PostBase }): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const { navigate } = useNavigation<UserStackNavigation>();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);
  const error = useError();
  const notification = useNotification();

  const onPostDelete = async (id: number): Promise<void> => {
    const deletePost = async (): Promise<void> => {
      try {
        await postsService.deletePost(id);
        notification('Post deleted successfully', false);
        navigate('Profile');
      } catch (e) {
        error(e);
      }
    };

    Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        onPress: (): null => null,
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: deletePost
      }
    ]);
  };

  const onPostEdit = (postId: number): void => {
    navigate('EditPost', { postId });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Pressable onPress={openMenu}><Entypo style={{ marginTop: 1 }} name="dots-three-horizontal" size={21} color="black" /></Pressable>}
      >
        <Menu.Item onPress={(): void => onPostEdit(post.id)} title="Edit" />
        <Menu.Item onPress={(): Promise<void> => onPostDelete(post.id)} title="Delete" />
      </Menu>
    </View>
  );
};

export default PostOptions;
