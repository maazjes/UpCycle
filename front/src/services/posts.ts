import { AxiosResponse } from 'axios';
import { PostPage, PostBase, Post } from '@shared/types';
import api from '../util/axiosInstance';
import { addQuery, createFormData } from '../util/helpers';
import { GetPostsQuery, UpdatePostBody, NewPostBody } from '../types';

const createPost = (body: NewPostBody): Promise<AxiosResponse<Post>> => {
  const formdata = createFormData(body);
  return api.postForm<Post>('posts', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const getPosts = (query: GetPostsQuery): Promise<AxiosResponse<PostPage>> => {
  const finalQuery = addQuery('posts', query);
  return api.get<PostPage>(finalQuery);
};

const getPost = (postId: number): Promise<AxiosResponse<Post>> => {
  const query = `posts/${postId}`;
  return api.get<Post>(query);
};

const deletePost = (postId: number): Promise<AxiosResponse<PostBase>> => {
  const query = `posts/${postId}`;
  return api.delete<PostBase>(query);
};

const updatePost = (
  postId: number,
  body: UpdatePostBody
): Promise<AxiosResponse<Post>> => {
  const formData = createFormData(body);
  return api.putForm<Post>(`posts/${postId}`, formData);
};

export { createPost, getPosts, getPost, deletePost, updatePost };
