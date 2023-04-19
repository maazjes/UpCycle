import { useRef, useState } from 'react';
import { PostPage, SharedGetPostsQuery } from '@shared/types';
import { emptyPage } from 'util/constants';
import { concatPages, deepEqual } from '../util/helpers';
import { getPosts } from '../services/posts';

const usePosts = (): [PostPage | null, typeof fetchPosts] => {
  const offset = useRef(0);
  const [posts, setPosts] = useState<PostPage | null>(null);
  const params = useRef<SharedGetPostsQuery>();

  const fetchPosts = async (fetchQuery?: SharedGetPostsQuery): Promise<void> => {
    if (!deepEqual(fetchQuery || {}, params.current || {})) {
      offset.current = 0;
    }

    console.log('offset', offset.current);

    const res = await getPosts({
      limit: 6,
      offset: offset.current,
      ...fetchQuery
    });

    setPosts(
      concatPages(offset.current === 0 ? { ...emptyPage } : posts || { ...emptyPage }, res.data)
    );
    offset.current += res.data.data.length;
    params.current = fetchQuery;
  };

  return [posts, fetchPosts];
};

export default usePosts;
