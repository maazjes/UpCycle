import { StyleSheet, GestureResponderEvent, Pressable, Image, View } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Container from 'components/Container';
import { dpw } from 'util/helpers';
import { useState } from 'react';
import Notification from 'components/Notification';
import { isAxiosError } from 'axios';
import LinkedInputs from 'components/LinkedInputs';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import useAuth from '../hooks/useAuth';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import Text from '../components/Text';
import { LoginStackScreen } from '../types';

const styles = StyleSheet.create({
  logo: {
    width: dpw(0.6),
    height: dpw((903 / 2134) * 0.6),
    marginBottom: dpw(0.04),
    alignSelf: 'center'
  },
  loginForm: {
    marginTop: dpw(0.2)
  },
  signUpButton: {
    alignSelf: 'center',
    marginTop: dpw(0.07)
  },
  resetPasswordButton: {
    alignSelf: 'center',
    marginTop: dpw(0.05)
  }
});

const validationSchema = yup.object().shape({
  emailOrUsername: yup
    .string()
    .min(3, 'Minimum length of email is 1')
    .max(30, 'Maximum length of email is 30')
    .required('Email or username is required'),
  password: yup
    .string()
    .min(1, 'Minimum length of password is 1')
    .max(50, 'Maximum length of password is 4')
    .required('password is required')
});

const Login = ({ navigation }: LoginStackScreen<'Login'>): JSX.Element => {
  const [notification, setNotification] = useState({ error: false, text: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { navigate } = navigation;

  const initialValues = {
    emailOrUsername: '',
    password: '',
    passwordConfirmation: ''
  };

  const onSubmit = async ({
    emailOrUsername,
    password
  }: {
    emailOrUsername: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> => {
    setLoading(true);
    try {
      const loginBody = emailOrUsername.includes('@')
        ? { email: emailOrUsername, password }
        : { username: emailOrUsername, password };
      await login(loginBody);
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView>
      <Container size="small" scrollable style={styles.loginForm}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }): JSX.Element => (
            <View>
              <LinkedInputs>
                <FormikTextInput name="emailOrUsername" placeholder="Email or username" />
                <FormikTextInput
                  returnKeyType="send"
                  onEndEditing={(): void => handleSubmit()}
                  secureTextEntry
                  name="password"
                  placeholder="Password"
                />
              </LinkedInputs>
              <Button
                loading={loading}
                onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
                text="Login"
              />
              <Notification
                style={{ marginTop: dpw(0.05) }}
                error={notification.error}
                text={notification.text}
              />
            </View>
          )}
        </Formik>
        <Pressable style={styles.signUpButton} onPress={(): void => navigate('VerifyEmail')}>
          <Text size="subheading" weight="bold" color="green">
            Sign up
          </Text>
        </Pressable>
        <Pressable
          style={styles.resetPasswordButton}
          onPress={(): void => navigate('ResetPassword')}
        >
          <Text weight="bold" size="subheading" color="green">
            Reset password
          </Text>
        </Pressable>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Login;
