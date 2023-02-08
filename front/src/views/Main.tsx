import { useEffect } from 'react';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';
import GridView from '../components/GridView';

const Main = (): JSX.Element => {
  const [posts, getPosts] = usePosts();
  useEffect((): void => {
    getPosts({ page: 0, size: 7 });
  }, []);
  if (!posts) {
    return <Loading />;
  }
  return (
    <GridView posts={posts} />
  );
};

export default Main;
