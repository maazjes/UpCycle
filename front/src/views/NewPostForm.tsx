import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

const NewPostForm = () => {
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(1, 'Minimum length of username is 1')
      .max(30, 'Maximum length of username is 30')
      .required('Username is required'),
    password: yup
      .string()
      .min(5, 'Minimum length os password is 5')
      .max(50, 'Maximum length of password is 50')
      .required('Password is required'),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
  });

  const initialValues = {
    title: '',
    price: ''
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <View style={styles.loginForm}>
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price" />
          <Button handleSubmit={handleSubmit} text="Register" />
        </View>
      )}
    </Formik>
  );
};

export default NewPostForm;
