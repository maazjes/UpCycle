import { StyleSheet, GestureResponderEvent, ScrollView } from 'react-native';
import { Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { NewPostBody } from 'types';
import { conditions } from 'util/constants';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { dpw } from 'util/helpers';
import { isAxiosError } from 'axios';
import FormikTextInput from './FormikTextInput';
import FormikImageInput from './FormikImageInput';
import PostCodeInput from './PostCodeInput';
import Button from './Button';
import Text from './Text';
import Container from './Container';
import CategoryPicker from './CategoryPicker';
import FormikPicker from './FormikPicker';
import LinkedInputs from './LinkedInputs';
import Notification from './Notification';
import KeyboardAvoidingView from './KeyboardAvoidingView';

const styles = StyleSheet.create({
  descriptionField: {
    height: dpw(0.3),
    paddingTop: dpw(0.05)
  },
  picker: {
    alignSelf: 'center',
    marginVertical: dpw(0.09)
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
  initialValues: NewPostBody & { initialCategory?: string };
  onSubmit: FormikConfig<NewPostBody>['onSubmit'];
}

const PostForm = ({ initialValues, onSubmit }: PostFormProps): JSX.Element | null => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });
  const [shouldHide, setShouldHide] = useState(false);
  const onFinalSubmit: FormikConfig<NewPostBody>['onSubmit'] = async (
    values,
    helpers
  ): Promise<void> => {
    setLoading(true);
    try {
      await onSubmit(values, helpers);
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  useFocusEffect((): (() => void) => {
    setShouldHide(false);
    return (): void => setShouldHide(true);
  });

  return !shouldHide ? (
    <KeyboardAvoidingView>
      <Container>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onFinalSubmit}
        >
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
              <FormikPicker
                initialValue="Condition"
                style={{ alignSelf: 'center', marginVertical: dpw(0.09) }}
                name="condition"
                items={conditions}
              />
              <CategoryPicker
                initialCategory={initialValues.initialCategory}
                style={{ alignSelf: 'center', marginBottom: dpw(0.09) }}
                createPost
              />
              <Text size="heading" align="center">
                Add photos
              </Text>
              <FormikImageInput
                boxStyle={{ margin: dpw(0.05) }}
                name="images"
                amount={3}
                maxAmount={5}
              />
              <Button
                loading={loading}
                onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
                text="Submit"
              />
              <Notification
                style={{ marginTop: dpw(0.03) }}
                text={notification.text}
                error={notification.error}
              />
            </ScrollView>
          )}
        </Formik>
      </Container>
    </KeyboardAvoidingView>
  ) : null;
};

export default PostForm;
