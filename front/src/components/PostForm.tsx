import { StyleSheet, GestureResponderEvent, ScrollView, View } from 'react-native';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { NewPostBody } from 'types';
import { conditions } from 'util/constants';
import FormikTextInput from './FormikTextInput';
import FormikImageInput from './FormikImageInput';
import PostCodeInput from './PostCodeInput';
import Button from './Button';
import Text from './Text';
import Container from './Container';
import CategoryPicker from './CategoryPicker';
import FormikPicker from './FormikPicker';
import LinkedInputs from './LinkedInputs';

const styles = StyleSheet.create({
  descriptionField: {
    height: 100,
    paddingTop: 13
  }
});

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, 'Minimum length of title is 3')
    .max(30, 'Maximum length of title is 30')
    .required('Title is required'),
  price: yup
    .number()
    .min(0, 'Minimum price is 0€')
    .max(1000, 'Maximum price is 1000€')
    .required('Price is required'),
  description: yup
    .string()
    .min(5, 'Minimum length of description is 10')
    .max(100, 'Maximum length of description is 100')
    .required('Description is required'),
  postcode: yup.string().min(5).max(5).required('Must be a valid postcode')
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
          <LinkedInputs>
            <FormikTextInput name="title" placeholder="Title" />
            <FormikTextInput name="price" placeholder="Price (€)" />
            <PostCodeInput name="postcode" placeholder="Postcode" />
            <FormikTextInput
              multiline
              textAlignVertical="top"
              style={styles.descriptionField}
              name="description"
              placeholder="Description"
            />
          </LinkedInputs>
          <View style={{ marginVertical: 30 }}>
            <FormikPicker
              initialValue="Valitse konditio"
              style={{ alignSelf: 'center', marginBottom: 30 }}
              name="condition"
              items={conditions}
            />
            <CategoryPicker style={{ alignSelf: 'center' }} createPost />
          </View>
          <Text size="heading" align="center">
            Lisää kuvia
          </Text>
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
