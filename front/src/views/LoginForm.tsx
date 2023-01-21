import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-native';
import loginService from '../services/login';
import useAuthStorage from '../hooks/useAuthStorage';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

const LoginForm = (): JSX.Element => {
  const authStorage = useAuthStorage();
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .min(3, 'Minimum length of username is 1')
      .max(30, 'Maximum length of username is 30')
      .required('username is required'),
    password: yup
      .string()
      .min(1, 'Minimum length of password is 1')
      .max(50, 'Maximum length of password is 4')
      .required('password is required'),
    passwordConfirmation: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
  });

  const initialValues = {
    username: '',
    password: '',
    passwordConfirmation: ''
  };

  const onSubmit = async ({ username, password }: {
    username: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> => {
    const response = await loginService.login(username, password);
    await authStorage.setAccessToken(response.data.token);
    axios.defaults.headers.common.Authorization = response.data.token;
    navigate('/');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.loginForm}>
          <FormikTextInput name="username" placeholder="username" />
          <FormikTextInput secureTextEntry name="password" placeholder="password" />
          <FormikTextInput secureTextEntry name="passwordConfirmation" placeholder="password confirmation" />
          <Button
            handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Submit"
          />
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
