import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { NewPostBody, UserStackScreen } from '../types';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/posts';
import { deleteImage } from '../services/images';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';

const EditPost = ({ route, navigation }: UserStackScreen<'EditPost'>): JSX.Element => {
  const notification = useNotification();
  const { postId } = route.params;
  const [currentPost, setCurrentPost] = useState<NewPostBody>();
  const error = useError();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getPost(postId);
      const post = {
        ...res.data,
        price: res.data.price.slice(0, -1),
        categories: res.data.categories.map((c): number => c.id)
      };
      setCurrentPost(post);
    };
    initialize();
  }, []);

  if (!currentPost) {
    return <Loading />;
  }

  const onSubmit = async ({ images, ...values }: NewPostBody): Promise<void> => {
    try {
      const valuesToAdd = { ...values, price: values.price.slice(0, -1) };
      (Object.keys(valuesToAdd) as Array<keyof Omit<NewPostBody, 'images'>>).forEach(
        (key): boolean =>
          (key === 'categories'
            ? valuesToAdd[key][0] === currentPost[key][0]
            : valuesToAdd[key] === currentPost[key]) && delete valuesToAdd[key]
      );
      const imageUris: string[] = [];
      images.forEach((newImage): void => {
        currentPost.images.forEach((currentImage): void => {
          if (newImage.uri === currentImage.uri) {
            imageUris.push(newImage.uri);
          }
        });
      });
      const imagesToAdd = [...images].filter((image): boolean => !imageUris.includes(image.uri));
      const imagesToDelete = [...currentPost.images].filter(
        (image): boolean => !imageUris.includes(image.uri)
      );
      const imagePromises = imagesToDelete.map(
        (image): Promise<AxiosResponse<undefined>> => deleteImage(image.id)
      );
      await Promise.all(imagePromises);
      const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
      await updatePost(Number(postId), finalValuesToAdd);
      const newcurrentPost = { ...currentPost, ...finalValuesToAdd };
      setCurrentPost(newcurrentPost);
      navigation.goBack();
    } catch (e) {
      error(e);
    }
  };

  return <PostForm onSubmit={onSubmit} initialValues={currentPost} />;
};

export default EditPost;
