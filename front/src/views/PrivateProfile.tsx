import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View, StyleSheet, Alert
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { DataTable, Menu, Button } from 'react-native-paper';
import { useAppSelector } from '../hooks/redux';
import { PostBase, User } from '../types';
import Text from '../components/Text';
import Loading from '../components/Loading';
import postsService from '../services/posts';
import usePosts from '../hooks/usePosts';
import useError from '../hooks/useError';
import useNotification from '../hooks/useNotification';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingTop: 20
  }
});

const PrivateProfile = (): JSX.Element => {
  const currentUser = useAppSelector((state): User => state.user);
  const [, getPosts] = usePosts();
  const [visiblePosts, setVisiblePosts] = useState<PostBase[] | null>(null);
  const [visible, setVisible] = React.useState<{ [x: string]: boolean }>({});
  const error = useError();
  const notification = useNotification();
  const navigate = useNavigate();

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
        const freshPosts = await getPosts({ userId: currentUser.id });
        setVisiblePosts(freshPosts);
      }
    };
    getAndSetPosts();
  }, []);

  if (!visiblePosts) {
    return <Loading />;
  }

  if (visiblePosts.length === 0) {
    return <Text>no posts to show</Text>;
  }

  const onPostDelete = async (id: number): Promise<void> => {
    const deletePost = async (): Promise<void> => {
      try {
        await postsService.deletePost(id);
        notification('Post deleted successfully', false);
        const newPosts = visiblePosts.filter((post): boolean => post.id !== id);
        if (newPosts) {
          setVisiblePosts(newPosts);
        }
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

  const onPostEdit = (id: number): void => {
    navigate(`/posts/edit/${id}`);
  };

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title><Text fontSize="subheading">Title</Text></DataTable.Title>
          <DataTable.Title><Text fontSize="subheading">Price</Text></DataTable.Title>
          <DataTable.Title>{}</DataTable.Title>
        </DataTable.Header>
        {visiblePosts.map((post): JSX.Element => (
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
