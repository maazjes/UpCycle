import { useRef, useState, useEffect } from 'react';
import { PostPage, SharedGetPostsQuery } from '@shared/types';
import { concatPages, deepEqual } from '../util/helpers';
import { getPosts } from '../services/posts';

const usePosts = (initialQuery?: SharedGetPostsQuery):
[PostPage | null, typeof fetchPosts] => {
  const offset = useRef(0);
  const oldOffset = useRef(0);
  const [posts, setPosts] = useState<PostPage | null>(null);
  const params = useRef<SharedGetPostsQuery>();

  const fetchPosts = async (fetchQuery?: SharedGetPostsQuery): Promise<void> => {
    if (offset.current === oldOffset.current && offset.current > 0) {
      return;
    }
    console.log('offset', offset.current);
    console.log('old offset', oldOffset.current);
    console.log('params', params.current);
    console.log('query', fetchQuery);
    oldOffset.current = offset.current;

    const res = await getPosts({
      limit: 4, offset: offset.current, ...fetchQuery
    });
    if (posts && deepEqual(fetchQuery || {}, params.current || {})) {
      setPosts(concatPages(posts, res.data));
    } else {
      offset.current = 0;
      oldOffset.current = 0;
      setPosts(res.data);
    }
    offset.current += res.data.data.length;
    params.current = fetchQuery;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      console.log(initialQuery);
      await fetchPosts(initialQuery);
    };
    initialize();
  }, []);

  return [posts, fetchPosts];
};

export default usePosts;
