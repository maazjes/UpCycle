import Container from 'components/Container';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { dpw } from 'util/helpers';
import Button from 'components/Button';
import { UserScreen } from 'types';
import GridView from 'components/GridView';
import { useTranslation } from 'react-i18next';
import useFavorites from 'hooks/useFavorites';
import Loading from '../components/Loading';
import Text from '../components/Text';

const styles = StyleSheet.create({
  noFavorites: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noFavoritesText: {
    marginVertical: dpw(0.03),
    textAlign: 'center'
  }
});

const Favorites = ({ navigation }: UserScreen<'StackFavorites'>): JSX.Element => {
  const [posts, fetchPosts] = useFavorites();
  const { t } = useTranslation();

  if (!posts) {
    return <Loading />;
  }

  if (posts.data.length === 0) {
    return (
      <Container style={styles.noFavorites}>
        <FontAwesome5 name="sad-cry" size={dpw(0.15)} color="black" />
        <Text style={styles.noFavoritesText} weight="bold" size="subheading">
          {t("You haven't added any favorites yet")}
        </Text>
        <Button
          text="Find new items"
          onPress={(): void => {
            navigation.navigate('Search', { screen: 'StackSearch', initial: false });
          }}
        />
      </Container>
    );
  }

  return (
    <GridView
      contentContainerStyle={{ paddingVertical: dpw(0.033) }}
      onEndReachedThreshold={0.2}
      onEndReached={fetchPosts}
      posts={posts.data}
    />
  );
};

export default Favorites;
