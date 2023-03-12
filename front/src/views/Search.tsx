import { Searchbar } from 'react-native-paper';
import { useState, useEffect, useRef } from 'react';
import useDebounce from 'hooks/useDebounce';
import GridView from 'components/GridView';
import { View } from 'react-native';
import { Category } from '@shared/types';
import { getCategories } from 'services/categories';
import Button from 'components/Button';
import CategoryPicker from 'components/CategoryPicker';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';

const Search = (): JSX.Element => {
  const [posts, getPosts] = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [visible, setVisible] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Category[][]>([[]]);
  const selectedCategories = useRef<Category['id'][]>([]);

  useEffect((): void => {
    const search = async (): Promise<void> => {
      await getPosts({ contains: debouncedSearchQuery });
    };
    search();
  }, [debouncedSearchQuery]);

  useEffect(():void => {
    const initialize = async (): Promise<void> => {
      const res = await getCategories();
      setActiveCategories([[...res.data]]);
    };
    initialize();
  }, []);

  const onChangeSearch = (query: string): void => setSearchQuery(query);

  const openModal = (): void => {
    if (selectedCategories) {
      selectedCategories.current = [];
      setActiveCategories([[...activeCategories[0]]]);
    }
    setVisible(true);
  };

  const closeModal = (): void => setVisible(false);

  if (!posts) {
    return <Loading />;
  }

  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <CategoryPicker
        search
        activeCategories={activeCategories}
        selectedCategories={selectedCategories}
        setActiveCategories={setActiveCategories}
        setVisible={setVisible}
        visible={visible}
        onDismiss={closeModal}
      />
      <Button style={{ margin: 30 }} text="asd" onPress={openModal} />
      <GridView posts={posts.data} />
    </View>
  );
};

export default Search;
