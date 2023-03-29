import { StyleSheet, View, Dimensions, FlatList, FlatListProps } from 'react-native';
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
  column: {},
  gridPostImage: {}
});

interface MasonryListProps
  extends Omit<
    FlatListProps<PostBase>,
    'data' | 'keyExtractor' | 'renderItem' | 'showsVerticalScrollIndicator'
  > {
  posts: Array<PostBase>;
}

const { width } = Dimensions.get('window');

const MasonryList = ({ posts, ...props }: MasonryListProps): JSX.Element => {
  const COLUMN_WIDTH = width / 2;
  const IMAGE_SPACING = COLUMN_WIDTH * 0.01;
  const COL_WIDTH = COLUMN_WIDTH - IMAGE_SPACING / 2;

  const [columns, setColumns] = useState<null | JSX.Element[][]>(null);

  const createMasonryLists = (newPosts: PostBase[], amount: number): void => {
    const postLists = Array(amount)
      .fill(-1)
      .map((): [number, JSX.Element[]] => [0, []]);
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
      sorted[0] = [sorted[0][0] + post.images[0].height, sorted[0][1].concat(postCard)];
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
    <FlatList
      {...props}
      numColumns={2}
      data={posts}
      keyExtractor={({ id }): string => String(id)}
      renderItem={({ item }): JSX.Element => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MasonryList;
