import { useRef, useState, useEffect } from 'react';
import { PostPage, SharedGetPostsQuery } from '@shared/types';
import { emptyPage } from '../util/constants';
import { concatPages } from '../util/helpers';
import { getPosts } from '../services/posts';

const usePosts = (query?: SharedGetPostsQuery):
[PostPage | null, typeof fetchPosts] => {
  const offset = useRef(0);
  const [posts, setPosts] = useState<PostPage>({ ...emptyPage });

  const fetchPosts = async (): Promise<PostPage> => {
    const res = await getPosts({ limit: 6, offset: offset.current, ...query });
    if (res.data) {
      offset.current += 6;
      setPosts(concatPages(posts, res.data));
    }
    return res.data;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchPosts();
    };
    initialize();
  }, []);

  return [posts, fetchPosts];
};

export default usePosts;
