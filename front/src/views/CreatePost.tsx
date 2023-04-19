import { NewPostBody, UserScreen } from 'types';
import { FormikConfig } from 'formik';
import { useAppDispatch } from 'hooks/redux';
import { addPost } from 'reducers/profilePosts';
import { createPost } from '../services/posts';
import PostForm from '../components/PostForm';

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

const CreatePost = ({ navigation }: UserScreen<'StackCreatePost'>): JSX.Element => {
  const dispatch = useAppDispatch();

  const onSubmit: FormikConfig<NewPostBody>['onSubmit'] = async (values): Promise<void> => {
    const price = `${values.price}€`;
    const images = values.images.map((image): string => image.uri);
    try {
      const { data } = await createPost({ ...values, price, images });
      dispatch(addPost({ id: data.id, images: data.images, title: data.title, price: data.price }));
      navigation.navigate('Profile', {
        screen: 'SinglePost',
        initial: false,
        params: { postId: data.id }
      });
    } catch {}
  };

  return <PostForm onSubmit={onSubmit} initialValues={initialValues} />;
};

export default CreatePost;
