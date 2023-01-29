import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl
} from 'react-native';
import GridPost from './GridPost';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  gridPostImage: {
    borderRadius: 15,
    margin: 5
  }
});

interface MasonryListProps {
  posts: Array<PostBase>[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

const MasonryList = ({
  posts,
  refreshing = false,
  onRefresh = (): void => {}
}: MasonryListProps): JSX.Element => (
  <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    style={styles.container}
    contentContainerStyle={{ paddingBottom: 200 }}
  >
    {Array.from(Array(posts.length)).map(
      (i: number): JSX.Element => (
        <View style={styles.column}>
          {posts[i].map((post): JSX.Element => (
            <View key={post.id} style={styles.column}>
              <GridPost imageStyle={styles.gridPostImage} containerStyle={{ width: '100%' }} post={post} />
            </View>
          ))}
        </View>
      )
    )}
  </ScrollView>
);

export default MasonryList;
