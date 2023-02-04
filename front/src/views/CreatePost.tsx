import useError from '../hooks/useError';
import useNotification from '../hooks/useNotification';
import postsService from '../services/posts';
import { Condition, NewPostProps } from '../types';
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

  const onSubmit = async (values: NewPostProps): Promise<void> => {
    try {
      await postsService.createPost({ ...values, price: `${values.price}€` });
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
