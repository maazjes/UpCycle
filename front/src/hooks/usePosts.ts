import { useRef, useState, useEffect } from 'react';
import { PostPage, SharedGetPostsQuery } from '@shared/types';
import { emptyPage } from '../util/constants';
import { concatPages } from '../util/helpers';
import { getPosts } from '../services/posts';

const usePosts = (query?: Omit<SharedGetPostsQuery, 'contains'>):
[PostPage | null, typeof fetchPosts] => {
  const offset = useRef(0);
  const [posts, setPosts] = useState<PostPage | null>(null);

  const fetchPosts = async (fetchQuery?: Pick<SharedGetPostsQuery, 'contains'>): Promise<PostPage> => {
    const res = await getPosts({
      limit: 6, offset: offset.current, ...query, ...fetchQuery
    });

    if (res.data) {
      if (fetchQuery) {
        setPosts(res.data);
      } else {
        offset.current += 6;
        setPosts(concatPages(posts || { ...emptyPage }, res.data));
      }
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
