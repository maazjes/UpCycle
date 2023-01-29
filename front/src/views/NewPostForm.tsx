import {
  View, StyleSheet, GestureResponderEvent
} from 'react-native';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ImagePickerAsset } from 'expo-image-picker';
import postService from '../services/posts';
import categoriesService from '../services/categories';
import FormikTextInput from '../components/FormikTextInput';
import FormikImageInput from '../components/FormikImageInput';
import FormikPicker from '../components/FormikPicker';
import PostCodeInput from '../components/PostCodeInput';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';
import Button from '../components/Button';
import { Category } from '../types';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  },
  descriptionField: {
    height: 100,
    paddingTop: 13
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
    .max(4, 'Maximum length of price is 4')
    .required('Price is required'),
  description: yup
    .string()
    .min(10, 'Minimum length of description is 10')
    .max(100, 'Maximum length of description is 100')
    .required('Description is required'),
  location: yup
    .object()
    .shape({
      postcode: yup.string().required(),
      city: yup.string().required('Invalid postnumber')
    })
});

const NewPostForm = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const notification = useNotification();
  const error = useError();
  useEffect((): void => {
    categoriesService.getCategories().then((result): void => {
      setCategories(result.data);
    });
  }, []);

  const onSubmit = async (values: {
    images: ImagePickerAsset[];
    title: string;
    price: string;
    category: string;
    description: string;
  }): Promise<void> => {
    console.log(values);
    try {
      await postService.newPost({ ...values, price: `${values.price}€` });
      notification('Post created successfully.', false);
    } catch (e) {
      error(e);
    }
  };

  const categoryNames = categories?.map((category): string => category.name);

  const initialValues = {
    title: '',
    price: '',
    images: [],
    description: '',
    location: { city: '', postcode: '' },
    category: ''
  };

  return (
    <View>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View style={styles.loginForm}>
            <FormikTextInput name="title" placeholder="Title" />
            <FormikTextInput name="price" placeholder="Price" />
            <PostCodeInput name="location" />
            <FormikTextInput multiline textAlignVertical="top" style={styles.descriptionField} name="description" placeholder="Description" />
            <FormikImageInput name="images" />
            {categoryNames ? <FormikPicker items={categoryNames} name="category" /> : <View />}
            <Button
              handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Submit"
            />
          </View>
        )}
      </Formik>

    </View>
  );
};

export default NewPostForm;
