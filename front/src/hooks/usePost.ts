import { useState, useEffect } from 'react';
import postsService from '../services/posts';
import { PostBase } from '../types';

const usePost = (postId: number): PostBase | null => {
  const [post, setPost] = useState<PostBase | null>(null);
  useEffect((): void => {
    const getUser = async (): Promise<void> => {
      const response = await postsService.getPostById(postId);
      const body = response.data;
      if (body) {
        setPost(body);
      }
    };
    getUser();
  }, []);
  return post;
};

export default usePost;
