import Container from 'components/Container';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { dpw, dph } from 'util/helpers';
import Button from 'components/Button';
import { UserStackScreen } from 'types';
import usePosts from '../hooks/usePosts';
import GridView from '../components/GridView';
import Loading from '../components/Loading';
import Text from '../components/Text';

const styles = StyleSheet.create({
  noFavorites: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noFavoritesText: {
    marginVertical: dph(0.01),
    textAlign: 'center'
  }
});

const Favorites = ({ navigation }: UserStackScreen<'StackFavorites'>): JSX.Element => {
  const [posts, fetchPosts] = usePosts({ favorite: 'true' });
  const { navigate } = navigation;

  if (!posts) {
    return <Loading />;
  }

  if (posts.data.length === 0) {
    return (
      <Container style={styles.noFavorites}>
        <FontAwesome5 name="sad-cry" size={dpw(0.15)} color="black" />
        <Text style={styles.noFavoritesText} weight="bold" size="subheading">Sinulla ei näytä olevan yhtäkään suosikkia.</Text>
        <Button text="Lisää suosikkeja" onPress={(): void => navigate('StackHome')} />
      </Container>
    );
  }

  return (
    <GridView
      posts={posts.data}
      onEndReachedThreshold={0.2}
      onEndReached={fetchPosts}
    />
  );
};

export default Favorites;
