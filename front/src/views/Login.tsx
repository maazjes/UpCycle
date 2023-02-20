import {
  View, StyleSheet, GestureResponderEvent, Pressable
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import Text from '../components/Text';
import { LoginStackParams } from '../types';

const styles = StyleSheet.create({
  loginForm: {
    justifyContent: 'center',
    margin: 12,
    marginTop: 100
  },
  signUp: {
    marginTop: 10,
    alignItems: 'center'
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

const Login = ({ navigation }: NativeStackScreenProps<LoginStackParams, 'Login'>): JSX.Element => {
  const { login } = useAuth();
  const error = useError();
  const { navigate } = navigation;
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
    } catch (e) {
      error(e);
    }
  };

  return (
    <View>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View style={styles.loginForm}>
            <FormikTextInput name="email" placeholder="email" />
            <FormikTextInput secureTextEntry name="password" placeholder="Password" />
            <Button
              handleSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Login"
            />
          </View>
        )}
      </Formik>
      <View style={styles.signUp}>
        <Pressable onPress={(): void => navigate('SignUp')}><Text fontWeight="bold" color="blue">Sign up</Text></Pressable>
      </View>
    </View>
  );
};

export default Login;
