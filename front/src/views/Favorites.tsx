import Container from 'components/Container';
import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { dpw, dph } from 'util/helpers';
import Button from 'components/Button';
import { UserStackScreen } from 'types';
import GridView from 'components/GridView';
import { useTranslation } from 'react-i18next';
import usePosts from '../hooks/usePosts';
import Loading from '../components/Loading';
import Text from '../components/Text';
import Scrollable from '../components/Scrollable';

const styles = StyleSheet.create({
  noFavorites: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  noFavoritesText: {
    marginVertical: dph(0.015),
    textAlign: 'center'
  }
});

const Favorites = ({ navigation }: UserStackScreen<'StackFavorites'>): JSX.Element => {
  const [posts, fetchPosts] = usePosts({ favorite: 'true' });
  const { navigate } = navigation;
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
        <Button text="Lisää suosikkeja" onPress={(): void => navigate('StackSearch')} />
      </Container>
    );
  }

  return (
    <Container>
      <Scrollable onEndReached={(): Promise<void> => fetchPosts({ favorite: 'true' })}>
        <GridView posts={posts.data} />
      </Scrollable>
    </Container>
  );
};

export default Favorites;
