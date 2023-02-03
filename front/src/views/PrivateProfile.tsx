import * as React from 'react';
import { useEffect } from 'react';
import {
  View, StyleSheet, Alert
} from 'react-native';
import { DataTable, Menu, Button } from 'react-native-paper';
import { useAppSelector } from '../hooks/redux';
import { User } from '../types';
import Text from '../components/Text';
import postsService from '../services/posts';
import usePosts from '../hooks/usePosts';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingTop: 20
  }
});

const PrivateProfile = (): JSX.Element => {
  const currentUser = useAppSelector((state): User => state.user);
  const [posts, getPosts] = usePosts({ page: 0, size: 5, userId: currentUser.id });
  const [visible, setVisible] = React.useState<{ [x: string]: boolean }>({});
  const openMenu = (postId: number): void => {
    visible[postId] = true;
    setVisible({ ...visible, postId: true });
  };
  const closeMenu = (postId: number): void => {
    visible[postId] = false;
    setVisible({ ...visible, postId: false });
  };
  const onDelete = async (id: number): Promise<void> => {
    const deletePost = async (): Promise<void> => {
      await postsService.deletePost(id);
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

  useEffect((): void => {
    getPosts();
  }, []);

  if (!posts) {
    return <Text>loading</Text>;
  }
  if (posts.length === 0) {
    return <Text>no posts to show</Text>;
  }
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
                <Menu.Item onPress={(): Promise<void> => onDelete(post.id)} title="Delete post" />
              </Menu>
            </DataTable.Cell>
          </DataTable.Row>

        ))}
      </DataTable>
    </View>
  );
};

export default PrivateProfile;
