import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import { PostBase } from '../types';

const newPost = async ({
  title,
  price,
  imageUri,
  category,
  description
}: {
  imageUri: string;
  title: string;
  price: string;
  category: string;
  description: string;
}): Promise<Object> => {
  const split = imageUri.split('.');
  const extension = split[split.length - 1];
  const img = {
    uri: imageUri,
    name: 'image',
    type: `image/${extension}`
  } as unknown as Blob;
  const formdata = new FormData();
  formdata.append('title', title);
  formdata.append('price', price);
  formdata.append('category', category);
  formdata.append('description', description);
  formdata.append('img', img);
  const res = await api.postForm<PostBase>('posts', formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res;
};

interface PostsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  posts: PostBase[] | [];
}

const getPosts = async ({ page, size, userId }: { page: number; size: number; userId?: number }):
Promise<AxiosResponse<PostsResponse>> => {
  let query = `posts?page=${page}&size=${size}`;
  if (userId) {
    query += `&userId=${userId}`;
  }
  const response = await api.get<PostsResponse>(query);
  return response;
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

export default {
  newPost, getPosts, getPostById, deletePost
};
