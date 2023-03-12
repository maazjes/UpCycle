import { StyleSheet, GestureResponderEvent, ScrollView } from 'react-native';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { NewPostBody } from 'types';
import { dph } from 'util/helpers';
import FormikTextInput from './FormikTextInput';
import FormikImageInput from './FormikImageInput';
import PostCodeInput from './PostCodeInput';
import Button from './Button';
import Text from './Text';
import Container from './Container';
import CategoryPicker from './CategoryPicker';

const styles = StyleSheet.create({
  descriptionField: {
    height: 100,
    paddingTop: 13
  },
  addPhotosText: {
    marginTop: dph(0.02)
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
  initialValues: NewPostBody;
  onSubmit: FormikConfig<NewPostBody>['onSubmit'];
}

const PostForm = ({ initialValues, onSubmit }: PostFormProps): JSX.Element => (
  <Container>
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price (€)" />
          <PostCodeInput name="postcode" />
          <FormikTextInput multiline textAlignVertical="top" style={styles.descriptionField} name="description" placeholder="Description" />
          <CategoryPicker createPost />
          <Text style={styles.addPhotosText} size="subheading" align="center">Lisää kuvia</Text>
          <FormikImageInput name="images" containerStyle={{ marginVertical: 10 }} amount={3} />
          <Button
            onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Submit"
          />
        </ScrollView>
      )}
    </Formik>
  </Container>
);

export default PostForm;
