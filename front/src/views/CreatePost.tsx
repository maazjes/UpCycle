import { Condition } from '@shared/types';
import { NewPostBody } from 'types';
import useError from '../hooks/useError';
import useNotification from '../hooks/useNotification';
import { createPost } from '../services/posts';
import PostForm from '../components/PostForm';

const CreatePost = (): JSX.Element => {
  const error = useError();
  const notification = useNotification();

  const initialValues = {
    title: '',
    price: '',
    images: [],
    description: '',
    postcode: '',
    condition: Condition.new,
    categories: []
  };

  const onSubmit = async (values: NewPostBody): Promise<void> => {
    try {
      await createPost({ ...values, price: `${values.price}€` });
      notification({ message: 'Post created successfully.', error: false, modal: false });
    } catch (e) {
      notification({ message: 'Failed creating the post. Please try again.', error: true, modal: false });
    }
  };

  return (
    <PostForm onSubmit={onSubmit} initialValues={initialValues} />
  );
};

export default CreatePost;
