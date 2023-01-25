import axios, { AxiosResponse } from 'axios';
import { PostBase } from '../types';

const baseUrl = 'http://192.168.0.104:8080/api/posts';

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
  const formdata = new FormData();
  formdata.append('title', title);
  formdata.append('price', price);
  formdata.append('category', category);
  formdata.append('description', description);
  const split = imageUri.split('.');
  const extension = split[split.length - 1];
  formdata.append(
    'img',
    JSON.parse(
      JSON.stringify({
        uri: imageUri,
        name: `image.${extension}`,
        type: `image/${extension}`
      })
    )
  );
  const res = await axios.post(baseUrl, formdata, {
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
  let query = `${baseUrl}?page=${page}&size=${size}`;
  if (userId) {
    query += `&userId=${userId}`;
  }
  const response = await axios.get(query);
  return response;
};

const getPostById = async (id: number): Promise<AxiosResponse<PostBase | null>> => {
  const query = `${baseUrl}/${id}`;
  const post = await axios.get(query);
  return post;
};

const deletePost = async (id: number): Promise<AxiosResponse<PostBase>> => {
  const query = `${baseUrl}/${id}`;
  const post = axios.delete(query);
  return post;
};

export default {
  newPost, getPosts, getPostById, deletePost
};
