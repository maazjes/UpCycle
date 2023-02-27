import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import {
  NewPostProps, TypedImage, Post, Optional,
  UserStackScreen
} from '../types';
import postsService from '../services/posts';
import imagesService from '../services/images';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';

type PartialPost = Optional<Post, 'user' | 'id'>;

const EditPost = ({ route }: UserStackScreen<'EditPost'>): JSX.Element => {
  const notification = useNotification();
  const { postId } = route.params;
  const [currentPost, setCurrentPost] = useState<PartialPost | null>(null);
  const error = useError();

  useEffect((): void => {
    const getAndSetPost = async (): Promise<void> => {
      const res = await postsService.getPost({ postId });
      setCurrentPost(res.data);
    };
    getAndSetPost();
  });

  if (!currentPost) {
    return (
      <Loading />
    );
  }

  const onSubmit = async ({ images, ...values }: NewPostProps): Promise<void> => {
    try {
      const valuesToAdd = { ...values, price: `${values.price}€` };
      (Object.keys(valuesToAdd) as Array<keyof Omit<NewPostProps, 'images'>>)
        .forEach(
          (key): boolean => (values[key] === currentPost[key]) && delete valuesToAdd[key]
        );
      const imageUris: string[] = [];
      images.forEach((newImage): void => {
        currentPost.images.forEach((currentImage): void => {
          if (newImage.uri === currentImage.uri) {
            imageUris.push(newImage.uri);
          }
        });
      });
      const imagesToAdd = ([...images])
        .filter((image): boolean => !imageUris.includes(image.uri));
      const imagesToDelete = ([...currentPost.images])
        .filter((image): boolean => !imageUris.includes(image.uri));
      const imagePromises = imagesToDelete
        .map((image): Promise<AxiosResponse<TypedImage>> => imagesService.deleteImage(image.id));
      await Promise.all(imagePromises);
      const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
      await postsService.updatePost(Number(postId), finalValuesToAdd);
      const newcurrentPost = { ...currentPost, ...finalValuesToAdd };
      setCurrentPost(newcurrentPost);
      notification('Post updated successfully.', false);
    } catch (e) {
      error(e);
    }
  };

  return (
    <PostForm onSubmit={onSubmit} initialValues={currentPost} />
  );
};

export default EditPost;
