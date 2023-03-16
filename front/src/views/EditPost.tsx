import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { Post } from '@shared/types';
import { NewPostBody, UserStackScreen } from '../types';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/posts';
import { deleteImage } from '../services/images';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';

const EditPost = ({ route }: UserStackScreen<'EditPost'>): JSX.Element => {
  const notification = useNotification();
  const { postId } = route.params;
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const error = useError();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getPost(postId);
      setCurrentPost(res.data);
    };
    initialize();
  });

  if (!currentPost) {
    return (
      <Loading />
    );
  }

  const onSubmit = async ({ images, ...values }: NewPostBody): Promise<void> => {
    try {
      const valuesToAdd = { ...values, price: `${values.price}€` };
      (Object.keys(valuesToAdd) as Array<keyof Omit<NewPostBody, 'images'>>)
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
        .map((image): Promise<AxiosResponse<undefined>> => deleteImage(image.id));
      await Promise.all(imagePromises);
      const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
      await updatePost(Number(postId), finalValuesToAdd);
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
