import { useState } from 'react';
import postsService from '../services/posts';
import { PostBase, GetPostsParams } from '../types';

const usePosts = ():
[PostBase[] | null, typeof getPosts] => {
  const [posts, setPosts] = useState<PostBase[] | null>(null);
  const getPosts = async (params: GetPostsParams | undefined): Promise<PostBase[]> => {
    const response = await postsService.getPosts(params);
    if (response.data.posts) {
      setPosts(response.data.posts);
    }
    return response.data.posts;
  };
  return [posts, getPosts];
};

export default usePosts;
