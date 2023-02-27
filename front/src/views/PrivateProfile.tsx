import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View, StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DataTable, Menu, Button } from 'react-native-paper';
import {
  UserStackNavigation, PostBase, TokenUser
} from '../types';
import { useAppSelector } from '../hooks/redux';
import Text from '../components/Text';
import Loading from '../components/Loading';
import postsService from '../services/posts';
import useError from '../hooks/useError';
import useNotification from '../hooks/useNotification';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingTop: 20
  }
});

const PrivateProfile = (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const [posts, setPosts] = useState<PostBase[] | null>(null);
  const [visible, setVisible] = React.useState<{ [x: string]: boolean }>({});
  const error = useError();
  const notification = useNotification();
  const { navigate } = useNavigation<UserStackNavigation>();

  const openMenu = (postId: number): void => {
    visible[postId] = true;
    setVisible({ ...visible, postId: true });
  };
  const closeMenu = (postId: number): void => {
    visible[postId] = false;
    setVisible({ ...visible, postId: false });
  };

  useEffect((): void => {
    const getAndSetPosts = async (): Promise<void> => {
      if (currentUser) {
        const res = await postsService.getPosts({ userId: currentUser.id });
        setPosts(res.data.posts);
      }
    };
    getAndSetPosts();
  }, []);

  if (!posts) {
    return <Loading />;
  }

  if (posts.length === 0) {
    return <Text>no posts to show</Text>;
  }

  const onPostDelete = async (id: number): Promise<void> => {
    const deletePost = async (): Promise<void> => {
      try {
        await postsService.deletePost(id);
        notification('Post deleted successfully', false);
        const newPosts = posts.filter((post): boolean => post.id !== id);
        setPosts(newPosts);
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
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title><Text fontSize="subheading">Title</Text></DataTable.Title>
          <DataTable.Title><Text fontSize="subheading">Price</Text></DataTable.Title>
          <DataTable.Title>{}</DataTable.Title>
        </DataTable.Header>
        {posts.map((post): JSX.Element => (
          <DataTable.Row key={String(post.id)}>
            <DataTable.Cell><Text>{post.title}</Text></DataTable.Cell>
            <DataTable.Cell><Text>{post.price}</Text></DataTable.Cell>
            <DataTable.Cell>
              <Menu
                visible={visible[post.id]}
                onDismiss={(): void => closeMenu(post.id)}
                anchor={(
                  <Button
                    key={post.id}
                    onPress={
                      (): void => openMenu(post.id)
                    }
                  >
                    <Text>Options</Text>
                  </Button>
                )}
              >
                <Menu.Item onPress={(): void => onPostEdit(post.id)} title="Edit" />
                <Menu.Item onPress={(): Promise<void> => onPostDelete(post.id)} title="Delete" />
              </Menu>
            </DataTable.Cell>
          </DataTable.Row>

        ))}
      </DataTable>
    </View>
  );
};

export default PrivateProfile;
