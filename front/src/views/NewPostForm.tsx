import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import postService from '../services/posts';
import FormikTextInput from '../components/FormikTextInput';
import FormikImageInput from '../components/FormikImageInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

const NewPostForm = (): JSX.Element => {
  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .min(3, 'Minimum length of title is 1')
      .max(30, 'Maximum length of title is 30')
      .required('Title is required'),
    price: yup
      .string()
      .min(1, 'Minimum length of price is 1')
      .max(50, 'Maximum length of price is 4')
      .required('Price is required')
  });

  const initialValues = {
    title: '',
    price: '',
    imageUri: ''
  };

  const onSubmit = async (values: {
    imageUri: string;
    title: string;
    price: string;
  }): Promise<void> => {
    await postService.newPost(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.loginForm}>
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price" />
          <FormikImageInput name="imageUri" />
          <Button
            handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Submit"
          />
        </View>
      )}
    </Formik>
  );
};

export default NewPostForm;
