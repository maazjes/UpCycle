import { AxiosResponse } from 'axios';
import { useState, useEffect } from 'react';
import { NewPostBody, UserScreen } from '../types';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/posts';
import { deleteImage } from '../services/images';

const EditPost = ({ route, navigation }: UserScreen<'EditPost'>): JSX.Element => {
  const { id: postId } = route.params;
  const [currentPost, setCurrentPost] = useState<NewPostBody & { initialCategory: string }>();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getPost(postId);
      const post = {
        ...res.data,
        price: res.data.price.slice(0, -1),
        categories: res.data.categories.map((c): number => c.id),
        initialCategory: res.data.categories[res.data.categories.length - 1].name
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
      if (
        Object.keys(valuesToAdd).length === 0 &&
        imagesToAdd.length &&
        imagesToDelete.length === 0
      ) {
        return;
      }
      const imagePromises = imagesToDelete.map(
        (image): Promise<AxiosResponse<undefined>> => deleteImage(image.id)
      );
      const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
      await updatePost(Number(postId), finalValuesToAdd);
      Promise.all(imagePromises);
      const newcurrentPost = { ...currentPost, ...finalValuesToAdd };
      setCurrentPost(newcurrentPost);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return <PostForm onSubmit={onSubmit} initialValues={currentPost} />;
};

export default EditPost;
