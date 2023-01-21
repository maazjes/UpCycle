import {
  View, Text, StyleSheet, GestureResponderEvent
} from 'react-native';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import postService from '../services/posts';
import categoriesService from '../services/categories';
import FormikTextInput from '../components/FormikTextInput';
import FormikImageInput from '../components/FormikImageInput';
import FormikPicker from '../components/FormikPicker';
import Button from '../components/Button';
import { Category } from '../types';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

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

const NewPostForm = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  useEffect((): void => {
    categoriesService.getCategories().then((result): void => {
      setCategories(result.data);
    });
  }, []);

  const onSubmit = async (values: {
    imageUri: string;
    title: string;
    price: string;
    category: string;
  }): Promise<void> => {
    await postService.newPost(values);
  };

  if (categories === null) {
    return <Text>loading</Text>;
  }

  if (categories[0].name === 'null') {
    return <Text>loading</Text>;
  }

  const initialValues = {
    title: '',
    price: '',
    imageUri: '',
    category: categories[0].name
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.loginForm}>
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price" />
          <FormikImageInput name="imageUri" />
          <FormikPicker items={categories} name="category" />
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
