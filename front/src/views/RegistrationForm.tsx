import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import useLogin from '../hooks/useLogin';
import usersService from '../services/users';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  RegistrationForm: {
    margin: 12
  }
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Minimum length of username is 1')
    .max(30, 'Maximum length of username is 30')
    .required('username is required'),
  name: yup
    .string()
    .min(5, 'Minimum length of name is 5')
    .max(10, 'Maximum length of name is 10')
    .required('name is required'),
  password: yup
    .string()
    .min(1, 'Minimum length of password is 1')
    .max(50, 'Maximum length of password is 4')
    .required('password is required'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('password confirmation is required')
});

const RegistrationForm = (): JSX.Element => {
  const navigate = useNavigate();
  const login = useLogin();

  const initialValues = {
    username: '',
    name: '',
    password: '',
    passwordConfirmation: ''
  };

  const onSubmit = async ({ username, name, password }: {
    username: string;
    name: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> => {
    const response = await usersService.register(username, name, password);
    if (!response) {
      return;
    }
    await login({ username, password });
    navigate('/');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.RegistrationForm}>
          <FormikTextInput name="username" placeholder="Username" />
          <FormikTextInput name="name" placeholder="Name" />
          <FormikTextInput secureTextEntry name="password" placeholder="Password" />
          <FormikTextInput secureTextEntry name="passwordConfirmation" placeholder="Password confirmation" />
          <Button
            handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Submit"
          />
        </View>
      )}
    </Formik>
  );
};

export default RegistrationForm;
