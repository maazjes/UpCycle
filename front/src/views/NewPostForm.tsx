import {
  View, StyleSheet, GestureResponderEvent, ScrollView
} from 'react-native';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import postService from '../services/posts';
import categoriesService from '../services/categories';
import FormikTextInput from '../components/FormikTextInput';
import FormikImageInput from '../components/FormikImageInput';
import FormikPicker from '../components/FormikPicker';
import PostCodeInput from '../components/PostCodeInput';
import useNotification from '../hooks/useNotification';
import useError from '../hooks/useError';
import Button from '../components/Button';
import {
  Category, NewPostProps, Condition
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

const NewPostForm = (): JSX.Element => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const notification = useNotification();
  const error = useError();
  useEffect((): void => {
    categoriesService.getCategories().then((result): void => {
      setCategories(result.data);
    });
  }, []);

  const onSubmit = async (values: NewPostProps): Promise<void> => {
    try {
      await postService.newPost({ ...values, price: `${values.price}€` });
      notification('Post created successfully.', false);
    } catch (e) {
      error(e);
    }
  };

  const categoryNames = categories ? categories.map((category): string => category.name) : [];

  const initialValues = {
    title: '',
    price: '',
    images: [],
    description: '',
    postcode: '',
    category: 'clothes',
    condition: Condition.new
  };

  const conditions = ['new', 'slightly used', 'used'];

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.loginForm}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <FormikTextInput style={{ width: '70.5%', marginRight: '1.5%' }} name="title" placeholder="Title" />
            <FormikTextInput style={{ width: '26.5%', marginLeft: '1.5%' }} name="price" placeholder="Price (€)" />
          </View>
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

export default NewPostForm;
