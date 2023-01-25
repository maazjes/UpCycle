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
  try {
    const res = await axios.post(baseUrl, formdata, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res;
  } catch (e) {
    throw new Error(`Adding the post failed ${e}`);
  }
};

interface PostsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  posts: PostBase[] | [];
}

const getPosts = async (page?: number, size?: number):
Promise<AxiosResponse<PostsResponse>> => {
  const query = `${baseUrl}?page=${page}&size=${size}`;
  try {
    const response = await axios.get(query);
    return response;
  } catch (e) {
    throw new Error(`Getting posts failed ${e}`);
  }
};

const getPostById = async (id: string): Promise<AxiosResponse<PostBase | null>> => {
  const query = `${baseUrl}/${id}`;
  try {
    const post = await axios.get(query);
    return post;
  } catch (e) {
    throw new Error(`Getting post failed ${e}`);
  }
};

export default { newPost, getPosts, getPostById };
