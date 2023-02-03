import * as React from 'react';
import { useEffect } from 'react';
import {
  View, StyleSheet
} from 'react-native';
import { DataTable } from 'react-native-paper';
import { useParams } from 'react-router-native';
import Text from '../components/Text';
import usePosts from '../hooks/usePosts';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingTop: 20
  }
});

const PublicProfile = (): JSX.Element => {
  const { userId } = useParams();
  const [posts, getPosts] = usePosts({ page: 0, size: 5, userId: Number(userId) ?? undefined });

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
        </DataTable.Header>
        {posts.map((post): JSX.Element => (
          <DataTable.Row key={String(post.id)}>
            <DataTable.Cell><Text>{post.title}</Text></DataTable.Cell>
            <DataTable.Cell><Text>{post.price}</Text></DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

export default PublicProfile;
