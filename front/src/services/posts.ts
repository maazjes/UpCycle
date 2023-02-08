import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import { addParams } from '../util/helpers';
import {
  PostBase, TypedImage, NewPostProps, PostsResponse, UpdatePostProps, GetPostsParams
} from '../types';

const formatImages = (images: TypedImage[]): Blob[] => {
  const formattedImages = [] as Blob[];
  images.forEach((image): void => {
    const split = image.uri.split('.');
    const extension = split[split.length - 1];
    const formattedImage = {
      uri: image.uri,
      name: 'image',
      type: `image/${extension}`
    } as unknown as Blob;
    formattedImages.push(formattedImage);
  });
  return formattedImages;
};

type CreateFormDataProps = Omit<UpdatePostProps, 'id' | 'favoriteId'>;

const createFormData = ({ images, ...props }: CreateFormDataProps): FormData => {
  const propKeys = Object.keys(props) as Array<keyof Omit<CreateFormDataProps, 'images'>>;
  const formdata = new FormData();
  if (images) {
    const formattedImages = formatImages(images);
    formattedImages.forEach((image): void => {
      formdata.append('images', image);
    });
  }
  propKeys.forEach((key): void => {
    const value = props[key];
    if (value) {
      formdata.append(key, value);
    }
  });
  return formdata;
};

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
  console.log('query', query);
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

const updatePost = async (postId: number, newPost: UpdatePostProps):
Promise<AxiosResponse<PostBase>> => {
  const formData = createFormData(newPost);
  const query = `posts/${postId}`;
  const post = await api.putForm(query, formData);
  return post;
};

export default {
  createPost, getPosts, getPostById, deletePost, updatePost
};
