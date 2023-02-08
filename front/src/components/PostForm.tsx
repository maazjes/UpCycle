import {
  View, StyleSheet, GestureResponderEvent, ScrollView
} from 'react-native';
import { useEffect, useState } from 'react';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import categoriesService from '../services/categories';
import FormikTextInput from './FormikTextInput';
import FormikImageInput from './FormikImageInput';
import FormikPicker from './FormikPicker';
import PostCodeInput from './PostCodeInput';
import Button from './Button';
import {
  Category, InitialPostValues
} from '../types';

const styles = StyleSheet.create({
  loginForm: {
    margin: 20
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
  postcode: yup
    .string()
    .min(5)
    .max(5)
    .required('Must be a valid postcode')
});

interface PostFormProps {
  initialValues: InitialPostValues;
  onSubmit: FormikConfig<InitialPostValues>['onSubmit'];
}

const PostForm = ({ initialValues, onSubmit }: PostFormProps): JSX.Element => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect((): void => {
    categoriesService.getCategories().then((result): void => {
      setCategories(result.data);
    });
  }, []);

  const categoryNames = categories ? categories.map((category): string => category.name) : [];

  const conditions = ['new', 'slightly used', 'used'];

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          style={styles.loginForm}
        >
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price (€)" />
          <PostCodeInput name="postcode" />
          <FormikTextInput multiline textAlignVertical="top" style={styles.descriptionField} name="description" placeholder="Description" />
          <FormikImageInput name="images" />
          <FormikPicker items={conditions} name="condition" />
          {categoryNames ? <FormikPicker items={categoryNames} name="category" /> : <View />}
          <Button
            handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Submit"
          />
          <View style={{ height: 110 }} />
        </ScrollView>
      )}
    </Formik>
  );
};

export default PostForm;
