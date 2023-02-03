import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import { PostBase, TypedImage, NewPostProps } from '../types';

const formatImages = (images: TypedImage[]): Blob[] => {
  const formattedImages = [] as Blob[];
  images.forEach((image): void => {
    const split = image.uri.split('.');
    const extension = split[split.length - 1];
    const formattedImage = {
      uri: image.uri,
      name: 'image',
      type: `image/${extension}`,
      width: image.width,
      height: image.height
    } as unknown as Blob;
    formattedImages.push(formattedImage);
  });
  return formattedImages;
};

const newPost = async ({
  title, price, images, category, description, postcode, condition
}: NewPostProps): Promise<AxiosResponse<PostBase>> => {
  const formattedImages = formatImages(images);
  const formdata = new FormData();
  formdata.append('title', title);
  formdata.append('price', price);
  formdata.append('category', category);
  formdata.append('description', description);
  formdata.append('postcode', postcode);
  formdata.append('condition', condition);
  formattedImages.forEach((image): void => {
    formdata.append('images', image);
  });
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
