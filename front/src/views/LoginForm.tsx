import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import useLogin from '../hooks/useLogin';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import useNotification from '../hooks/useNotification';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

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
    .required('password is required')
});

const LoginForm = (): JSX.Element => {
  const notification = useNotification();
  const navigate = useNavigate();
  const login = useLogin();

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
    try {
      await login({ username, password });
      navigate('/');
    } catch (e) {
      notification(`login failed ${e}`, true);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.loginForm}>
          <FormikTextInput name="username" placeholder="Username" />
          <FormikTextInput secureTextEntry name="password" placeholder="Password" />
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
