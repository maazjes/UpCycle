import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions
} from 'react-native';
import { useEffect, useState } from 'react';
import { PostBase } from '@shared/types';
import PostCard from './PostCard';

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  column: {
  },
  gridPostImage: {
  }
});

interface MasonryListProps {
  posts: Array<PostBase>;
}

const { width } = Dimensions.get('window');

const MasonryList = ({
  posts
}: MasonryListProps): JSX.Element => {
  const COLUMN_WIDTH = width / 2;
  const IMAGE_SPACING = COLUMN_WIDTH * 0.01;
  const COL_WIDTH = COLUMN_WIDTH - (IMAGE_SPACING / 2);

  const [columns, setColumns] = useState<null | JSX.Element[][]>(null);
  const createMasonryLists = (newPosts: PostBase[], amount: number): void => {
    const postLists = Array(amount).fill(-1).map((): [number, JSX.Element[]] => [0, []]);
    newPosts.forEach((post): void => {
      const imageWidth = COL_WIDTH;
      const widthReductionFactor = COL_WIDTH / post.images[0].width;
      const imageHeight = post.images[0].height * widthReductionFactor;
      const postCard = (
        <PostCard
          post={post}
          imageStyle={[styles.gridPostImage, { aspectRatio: imageWidth / imageHeight }]}
          containerStyle={{ marginVertical: 5 }}
        />
      );

      const sorted = postLists.sort((a, b): number => a[0] - b[0]);
      if (post.images) {
        sorted[0] = [sorted[0][0] + post.images[0].height, sorted[0][1].concat(postCard)];
      }
    });
    const finalPostLists = postLists.map((postList): JSX.Element[] => postList[1]);
    setColumns(finalPostLists);
  };

  useEffect((): void => {
    createMasonryLists(posts, 2);
  }, []);

  if (!columns) {
    return <View />;
  }

  return (
    <ScrollView
      removeClippedSubviews
    >
      <View style={styles.container}>
        <View
          style={{ width: '50%', paddingLeft: 12, paddingRight: 5 }}
        >
          {columns[0]}

        </View>
        <View
          style={{ width: '50%', paddingLeft: 6, paddingRight: 12 }}
        >
          {columns[1]}

        </View>
      </View>
    </ScrollView>
  );
};

export default MasonryList;
