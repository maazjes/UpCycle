import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import {
  NewPostProps, TypedImage, InitialPostValues, PostBase, Optional,
  UserStackScreen
} from '../types';
import postsService from '../services/posts';
import imagesService from '../services/images';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';
import usePosts from '../hooks/usePosts';

type PartialPostBase = Optional<PostBase, 'user' | 'id'>;

const EditPost = ({ route }: UserStackScreen<'EditPost'>): JSX.Element => {
  const notification = useNotification();
  const error = useError();
  const { postId } = route.params;
  const [currentValues, setCurrentValues] = useState<null | InitialPostValues>(null);
  const [, getPosts] = usePosts();

  useEffect((): void => {
    const getAndSetValues = async (): Promise<void> => {
      const freshPosts = await getPosts(
        { page: 0, size: 1, postId: Number(postId) }
      );
      const post = freshPosts[0] as unknown as PartialPostBase;
      if (freshPosts && post) {
        delete post.user;
        delete post.id;
        setCurrentValues(freshPosts[0]);
      }
    };
    getAndSetValues();
  }, []);

  if (!postId || !currentValues) {
    return (
      <Loading />
    );
  }

  const onSubmit = async ({ images, ...values }: NewPostProps): Promise<void> => {
    try {
      const valuesToAdd = { ...values, price: `${values.price}€` };
      (Object.keys(valuesToAdd) as Array<keyof Omit<NewPostProps, 'images'>>)
        .forEach(
          (key): boolean => (values[key] === currentValues[key]) && delete valuesToAdd[key]
        );
      const imageUris: string[] = [];
      images.forEach((newImage): void => {
        currentValues.images.forEach((currentImage): void => {
          if (newImage.uri === currentImage.uri) {
            imageUris.push(newImage.uri);
          }
        });
      });
      const imagesToAdd = ([...images])
        .filter((image): boolean => !imageUris.includes(image.uri));
      const imagesToDelete = ([...currentValues.images])
        .filter((image): boolean => !imageUris.includes(image.uri));
      const imagePromises = imagesToDelete
        .map((image): Promise<AxiosResponse<TypedImage>> => imagesService.deleteImage(image.id));
      await Promise.all(imagePromises);
      const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
      await postsService.updatePost(Number(postId), finalValuesToAdd);
      const newCurrentValues = { ...currentValues, ...finalValuesToAdd };
      setCurrentValues(newCurrentValues);
      notification('Post updated successfully.', false);
    } catch (e) {
      error(e);
    }
  };

  return (
    <PostForm onSubmit={onSubmit} initialValues={currentValues} />
  );
};

export default EditPost;
