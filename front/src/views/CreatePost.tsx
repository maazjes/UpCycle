import { NewPostBody, UserScreen } from 'types';
import { FormikConfig } from 'formik';
import { createPost } from '../services/posts';
import PostForm from '../components/PostForm';

const CreatePost = ({ navigation }: UserScreen<'StackCreatePost'>): JSX.Element => {
  const initialValues = {
    title: '',
    price: '',
    images: [],
    description: '',
    postcode: '',
    city: '',
    condition: '',
    categories: []
  };

  const onSubmit: FormikConfig<NewPostBody>['onSubmit'] = async (values): Promise<void> => {
    const price = `${values.price}€`;
    try {
      const res = await createPost({ ...values, price });
      navigation.navigate('Profile', {
        screen: 'SinglePost',
        initial: false,
        params: { postId: res.data.id }
      });
    } catch {}
  };

  return <PostForm onSubmit={onSubmit} initialValues={initialValues} />;
};

export default CreatePost;
