import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import {
  addParams, createFormData
} from '../util/helpers';
import {
  PostBase, NewPostProps, PostsResponse, UpdatePostProps, GetPostsParams
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

const getPosts = async (params?: GetPostsParams):
Promise<AxiosResponse<PostsResponse>> => {
  let query = 'posts';
  query = params ? addParams(query, params) : query;
  const posts = await api.get<PostsResponse>(query);
  return posts;
};

const getPostById = async (id: number): Promise<AxiosResponse<PostBase | null>> => {
  const query = `posts/${id}`;
  const post = await api.get<PostBase | null>(query);
  return post;
};

const deletePost = async (id: number): Promise<AxiosResponse<PostBase>> => {
  const query = `posts/${id}`;
  const post = api.delete<PostBase>(query);
  return post;
};

const updatePost = async (id: number, newPost: UpdatePostProps):
Promise<AxiosResponse<PostBase>> => {
  const formData = createFormData(newPost);
  const post = await api.putForm<PostBase>(`posts/${id}`, formData);
  return post;
};

export default {
  createPost, getPosts, getPostById, deletePost, updatePost
};
