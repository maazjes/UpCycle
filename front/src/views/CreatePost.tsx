import { NewPostBody, UserStackScreen } from 'types';
import useNotification from '../hooks/useNotification';
import { createPost } from '../services/posts';
import PostForm from '../components/PostForm';

const CreatePost = ({ navigation }: UserStackScreen<'StackCreatePost'>): JSX.Element => {
  const notification = useNotification();
  const initialValues = {
    title: '',
    price: '',
    images: [],
    description: '',
    postcode: -1,
    city: '',
    condition: '',
    categories: []
  };

  const onSubmit = async (values: NewPostBody): Promise<void> => {
    try {
      await createPost({ ...values, price: `${values.price}€` });
    } catch (e) {
      notification({
        message: 'Failed creating the post. Please try again.',
        error: true,
        modal: false
      });
    }
    navigation.getParent()?.navigate('Profile');
  };

  return <PostForm onSubmit={onSubmit} initialValues={initialValues} />;
};

export default CreatePost;
