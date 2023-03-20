import {
  View,
  StyleSheet,
  GestureResponderEvent,
  Pressable,
  Image
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Container from 'components/Container';
import { dph, dpw } from 'util/helpers';
import useNotification from 'hooks/useNotification';
import { isAxiosError } from 'axios';
import useAuth from '../hooks/useAuth';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import Text from '../components/Text';
import { LoginStackScreen } from '../types';

const styles = StyleSheet.create({
  logo: {
    width: dpw(0.6),
    height: dpw((903 / 2134) * 0.6),
    marginBottom: dph(0.02),
    alignSelf: 'center'
  },
  loginForm: {
    marginTop: dph(0.1)
  },
  signUpButton: {
    alignSelf: 'center',
    marginTop: dph(0.03)
  },
  loginButton: {
    marginTop: dph(0.015)
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

const Login = ({ navigation }: LoginStackScreen<'Login'>): JSX.Element => {
  const { login } = useAuth();
  const notification = useNotification();
  const { navigate } = navigation;

  const initialValues = {
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  const onSubmit = async ({
    email,
    password
  }: {
    email: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> => {
    try {
      await login({ email, password });
    } catch (e) {
      if (isAxiosError(e)) {
        notification({ message: e.message, error: true, modal: false });
      }
    }
  };

  return (
    <Container style={styles.loginForm}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <Image style={styles.logo} source={require('../../assets/logo.png')} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }): JSX.Element => (
          <View>
            <FormikTextInput name="email" placeholder="email" />
            <FormikTextInput
              secureTextEntry
              name="password"
              placeholder="Password"
            />
            <Button
              style={styles.loginButton}
              onPress={
                handleSubmit as unknown as (
                  event: GestureResponderEvent
                ) => void
              }
              text="Login"
            />
          </View>
        )}
      </Formik>
      <Pressable
        style={styles.signUpButton}
        onPress={(): void => navigate('SignUp')}
      >
        <Text weight="bold" color="green">
          Sign up
        </Text>
      </Pressable>
      <Pressable
        style={styles.signUpButton}
        onPress={(): void => navigate('ResetPassword')}
      >
        <Text weight="bold" color="green">
          Reset password
        </Text>
      </Pressable>
    </Container>
  );
};

export default Login;
