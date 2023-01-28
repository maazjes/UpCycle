import { useState } from 'react';
import postsService from '../services/posts';
import { PostBase } from '../types';

const usePosts = (params: { page: number; size: number; userId?: number }):
[PostBase[] | null, typeof getPosts] => {
  const [posts, setPosts] = useState<PostBase[] | null>(null);
  const getPosts = async (): Promise<void> => {
    const response = await postsService.getPosts(params);
    if (response.data.posts) {
      setPosts(response.data.posts);
    }
  };
  return [posts, getPosts];
};

export default usePosts;
