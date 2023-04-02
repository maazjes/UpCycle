import { AppState } from 'react-native';
import * as yup from 'yup';
import { dph } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen } from 'types';
import Text from 'components/Text';
import { Fontisto } from '@expo/vector-icons';
import { Formik } from 'formik';
import { checkEmailVerified, verifyEmail } from 'services/verifyEmail';
import { useEffect, useRef, useState } from 'react';
import Notification from 'components/Notification';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const validationSchema = yup.object().shape({
  email: yup.string().email().required('email is required'),
  username: yup
    .string()
    .min(2, 'Minimum length of name is 2')
    .max(15, 'Maximum length of name is 15')
    .required('Username is required'),
  bio: yup
    .string()
    .min(1, 'Minimum length of name is 2')
    .max(150, 'Maximum length of name is 150')
    .required('Username is required'),
  displayName: yup
    .string()
    .min(1, 'Minimum length of name is 2')
    .max(15, 'Maximum length of name is 15')
    .required('Name is required'),
  password: yup
    .string()
    .min(5, 'Minimum length of password is 5')
    .max(20, 'Maximum length of password is 20')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required')
});

const VerifyEmail = ({ navigation }: LoginStackScreen<'VerifyEmail'>): JSX.Element => {
  const appState = useRef(AppState.currentState);
  const emailRef = useRef<string>();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const emailVerifiedCheck = async (): Promise<void> => {
    if (emailRef.current) {
      const res = await checkEmailVerified({ email: emailRef.current });
      if (res.data.verified) {
        navigation.navigate('AddInformation', { email: emailRef.current });
        setVerified(true);
      }
    }
  };

  useEffect((): (() => void) => {
    const subscription = AppState.addEventListener('change', (nextAppState): void => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        emailVerifiedCheck();
      }
      appState.current = nextAppState;
    });

    return (): void => {
      subscription.remove();
    };
  }, []);

  const initialValues = {
    email: ''
  };

  const onSubmit = async ({ email }: { email: string }): Promise<void> => {
    emailRef.current = email;
    if (!verified) {
      setLoading(true);
      try {
        await verifyEmail({ email });
        setNotification('A verification link has been sent to your email');
      } catch {}
    } else {
      navigation.navigate('AddInformation', { email: emailRef.current });
    }
    setLoading(false);
  };

  return (
    <Container size="small" scrollable>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <>
            <Fontisto
              style={{ marginBottom: dph(0.015), alignSelf: 'center' }}
              name="email"
              size={70}
              color="black"
            />
            <Text align="center" style={{ marginBottom: dph(0.015) }} size="heading" weight="bold">
              Enter your email
            </Text>
            <Text color="grey" style={{ marginBottom: dph(0.03) }}>
              Enter your email below and well send you an email to verify your account.
            </Text>
            <FormikTextInput name="email" placeholder="Email" />
            <Button
              style={{ marginBottom: dph(0.02) }}
              loading={loading}
              onPress={handleSubmit}
              text={!verified ? 'Send link' : 'Continue'}
            />
            <Notification text={notification} />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default VerifyEmail;
