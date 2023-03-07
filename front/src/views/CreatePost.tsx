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
    category: 'clothes',
    condition: Condition.new
  };

  const onSubmit = async (values: NewPostBody): Promise<void> => {
    try {
      console.log(values);
      await createPost({ ...values, price: `${values.price}€` });
      notification('Post created successfully.', false);
    } catch (e) {
      error(e);
    }
  };

  return (
    <PostForm onSubmit={onSubmit} initialValues={initialValues} />
  );
};

export default CreatePost;
