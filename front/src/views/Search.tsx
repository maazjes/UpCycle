import { Searchbar } from 'react-native-paper';
import { useState, useEffect, useRef } from 'react';
import useDebounce from 'hooks/useDebounce';
import CategoryPicker from 'components/CategoryPicker';
import { SearchPostsQuery } from 'types';
import Picker from 'components/Picker';
import { Condition } from '@shared/types';
import { View, StyleSheet } from 'react-native';
import { conditions } from 'util/constants';
import GridView from 'components/GridView';
import Container from 'components/Container';
import { dpw } from 'util/helpers';
import theme from 'styles/theme';
import cities from '../../assets/cities.json';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';

const styles = StyleSheet.create({
  postOptions: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  searchBar: {
    fontSize: theme.fontSizes.heading,
    alignItems: 'center'
  }
});

const Search = (): JSX.Element => {
  const [posts, fetchPosts] = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [category, setCategory] = useState<number>();
  const [condition, setCondition] = useState<Condition | 'All'>();
  const [city, setCity] = useState<string | null>();
  const searchParams = useRef<SearchPostsQuery>();

  useEffect((): void => {
    const search = async (): Promise<void> => {
      let query: SearchPostsQuery = { contains: debouncedSearchQuery };
      if (category && category !== -1) {
        query = { ...query, categoryId: String(category) };
      }
      if (condition && condition !== 'All') {
        query = { ...query, condition };
      }
      if (city && city !== 'All') {
        query = { ...query, city };
      }
      if (query) {
        try {
          await fetchPosts(query);
        } catch {}
      }
      searchParams.current = query;
    };
    search();
  }, [category, debouncedSearchQuery, condition, city]);

  const header = (): JSX.Element => (
    <View>
      <Searchbar
        inputStyle={styles.searchBar}
        placeholder="Keyword"
        onChangeText={(query: string): void => setSearchQuery(query)}
        value={searchQuery || ''}
      />
      <Container center>
        <Picker
          searchbar
          style={{ marginVertical: dpw(0.09) }}
          onValueChange={(value): void => setCity(value)}
          selectedValue={city || 'City'}
          items={['All', ...cities]}
        />
        <CategoryPicker style={{ marginBottom: dpw(0.09) }} search setCategory={setCategory} />
        <Picker
          style={{ marginBottom: dpw(0.09) }}
          items={['All', ...conditions]}
          selectedValue={condition ?? 'Condition'}
          onValueChange={(value): void => setCondition(value as Condition)}
        />
      </Container>
    </View>
  );

  if (!posts) {
    return <Loading />;
  }

  return (
    <GridView
      posts={posts.data}
      onEndReached={(): Promise<void> => fetchPosts(searchParams.current)}
      onEndReachedThreshold={0.3}
      ListHeaderComponent={header()}
    />
  );
};

export default Search;
