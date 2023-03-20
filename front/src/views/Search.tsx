import { Searchbar } from 'react-native-paper';
import { useState, useEffect, useRef } from 'react';
import useDebounce from 'hooks/useDebounce';
import CategoryPicker from 'components/CategoryPicker';
import Scrollable from 'components/Scrollable';
import GridView from 'components/GridView';
import { SearchPostsQuery } from 'types';
import useNotification from 'hooks/useNotification';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';

const Search = (): JSX.Element => {
  const [posts, fetchPosts] = usePosts();
  const [searchQuery, setSearchQuery] = useState<string>();
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [category, setCategory] = useState<number>();
  const searchParams = useRef<SearchPostsQuery>();
  const notification = useNotification();

  useEffect((): void => {
    const search = async (): Promise<void> => {
      let query: SearchPostsQuery | undefined;
      if (debouncedSearchQuery) {
        query = { ...query, contains: debouncedSearchQuery };
      }
      if (category) {
        query = { ...query, categoryId: String(category) };
      }
      try {
        await fetchPosts(query);
      } catch (e) {
        notification({
          message: 'Something went wrong. Please try again.',
          error: true,
          modal: true
        });
      }
      searchParams.current = query;
    };
    search();
  }, [category, debouncedSearchQuery]);

  const onChangeSearch = (query: string): void => setSearchQuery(query);

  if (!posts) {
    return <Loading />;
  }

  return (
    <Scrollable onEndReached={(): Promise<void> => fetchPosts(searchParams.current)}>
      <Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery || ''} />
      <CategoryPicker style={{ paddingVertical: 10 }} search setCategory={setCategory} />
      <GridView posts={posts.data} />
    </Scrollable>
  );
};

export default Search;
