import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import useLogin from '../hooks/useLogin';
import useError from '../hooks/useError';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  loginForm: {
    margin: 12
  }
});

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, 'Minimum length of email is 1')
    .max(30, 'Maximum length of email is 30')
    .required('email is required'),
  password: yup
    .string()
    .min(1, 'Minimum length of password is 1')
    .max(50, 'Maximum length of password is 4')
    .required('password is required')
});

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const login = useLogin();
  const error = useError();

  const initialValues = {
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  const onSubmit = async ({ email, password }: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> => {
    try {
      await login({ email, password });
      navigate('/');
    } catch (e) {
      error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.loginForm}>
          <FormikTextInput name="email" placeholder="email" />
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

export default Login;
