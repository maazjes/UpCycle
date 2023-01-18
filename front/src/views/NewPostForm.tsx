import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

import FormikTextInput from '../components/FormikTextInput';
import FormikImageInput from '../components/FormikImageInput';
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

  const onSubmit = async ({ title, price, image }) => {
    console.log(title);
    console.log(price);
    console.log(image);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      /* validationSchema={validationSchema} */ onSubmit={onSubmit}
    >
      {({ handleSubmit }) => (
        <View style={styles.loginForm}>
          <FormikTextInput name="title" placeholder="Title" />
          <FormikTextInput name="price" placeholder="Price" />
          <FormikTextInput name="image" placeholder="Image" />
          <FormikImageInput name="image" text="Choose image" />
          <Button handleSubmit={handleSubmit} text="Submit" />
        </View>
      )}
    </Formik>
  );
};

export default NewPostForm;
