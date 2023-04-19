import { AxiosResponse } from 'axios';
import { useRef } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { editPost } from 'reducers/profilePosts';
import { editSinglePost } from 'reducers/singlePost';
import { TypedImage } from '@shared/types';
import { NewPostBody, UserScreen } from '../types';
import PostForm from '../components/PostForm';
import { updatePost } from '../services/posts';
import { deleteImage } from '../services/images';

const EditPost = ({ route }: UserScreen<'EditPost'>): JSX.Element => {
  const currentPost = useRef<NewPostBody & { initialCategory: string }>({
    ...route.params,
    price: route.params.price.slice(0, -1),
    categories: route.params.categories.map((c): number => c.id),
    initialCategory: route.params.categories[route.params.categories.length - 1].name,
    images: route.params.images.map(
      (image): TypedImage => ({
        ...image,
        uri: `${image.uri}_200x200?alt=media`
      })
    )
  });
  const dispatch = useAppDispatch();
  const { id: postId } = route.params;

  const onSubmit = async ({ images, ...values }: NewPostBody): Promise<void> => {
    const valuesToAdd = { ...values, price: `${values.price}€` };
    (Object.keys(valuesToAdd) as Array<keyof Omit<NewPostBody, 'images'>>).forEach(
      (key): boolean =>
        (key === 'categories'
          ? valuesToAdd[key][0] === currentPost.current[key][0]
          : valuesToAdd[key] === currentPost.current[key]) && delete valuesToAdd[key]
    );
    const imageUris: string[] = [];
    images.forEach((newImage): void => {
      currentPost.current.images.forEach((currentImage): void => {
        if (newImage.uri === currentImage.uri) {
          imageUris.push(newImage.uri);
        }
      });
    });
    const imagesToAdd = [...images].filter((image): boolean => !imageUris.includes(image.uri));
    const imagesToDelete = [...currentPost.current.images].filter(
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
      (image): Promise<AxiosResponse<undefined>> => deleteImage(image.id as number)
    );
    const finalValuesToAdd = { ...valuesToAdd, images: imagesToAdd };
    try {
      const { data: newPost } = await updatePost(Number(postId), finalValuesToAdd);
      Promise.all(imagePromises);
      const newCurrentPost = { ...currentPost.current, ...finalValuesToAdd };
      dispatch(editPost(newPost));
      dispatch(editSinglePost(newPost));
      currentPost.current = newCurrentPost;
    } catch {}
  };

  return <PostForm onSubmit={onSubmit} initialValues={currentPost.current} />;
};

export default EditPost;
