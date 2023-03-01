import { AxiosResponse } from 'axios';
import { PostPages } from '@shared/types';
import api from '../util/axiosInstance';
import {
  addParams, createFormData
} from '../util/helpers';
import {
  PostBase, Post, NewPostProps, UpdatePostProps, GetPostsQuery
} from '../types';

const createPost = async (newPost: NewPostProps): Promise<AxiosResponse<PostBase>> => {
  const formdata = createFormData(newPost);
  const post = await api.postForm<PostBase>('posts', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return post;
};

const getPosts = async (params?: GetPostsQuery):
Promise<AxiosResponse<PostPages>> => {
  let query = 'posts';
  query = params ? addParams(query, params) : query;
  const posts = await api.get<PostPages>(query);
  return posts;
};

const getPost = async ({ postId }: { postId: number }): Promise<AxiosResponse<Post>> => {
  const query = `posts/${postId}`;
  const post = await api.get<Post>(query);
  return post;
};

const deletePost = async (id: number): Promise<AxiosResponse<PostBase>> => {
  const query = `posts/${id}`;
  const post = api.delete<PostBase>(query);
  return post;
};

const updatePost = async (id: number, newPost: UpdatePostProps):
Promise<AxiosResponse<Post>> => {
  const formData = createFormData(newPost);
  const post = await api.putForm<Post>(`posts/${id}`, formData);
  return post;
};

export default {
  createPost, getPosts, getPost, deletePost, updatePost
};
