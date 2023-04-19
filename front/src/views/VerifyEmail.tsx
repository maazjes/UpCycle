import { AppState, StyleSheet } from 'react-native';
import * as yup from 'yup';
import { dpw } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen } from 'types';
import Text from 'components/Text';
import { Fontisto } from '@expo/vector-icons';
import { Formik } from 'formik';
import { checkEmailVerified, verifyEmail } from 'services/emails';
import { useEffect, useRef, useState } from 'react';
import Notification from 'components/Notification';
import { isAxiosError } from 'axios';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  emailIcon: {
    marginBottom: dpw(0.02),
    alignSelf: 'center'
  }
});
const validationSchema = yup.object().shape({
  email: yup.string().email('Must be a valid email address').required('Email is required')
});

const initialValues = {
  email: ''
};

const VerifyEmail = ({ navigation }: LoginStackScreen<'VerifyEmail'>): JSX.Element => {
  const appState = useRef(AppState.currentState);
  const emailRef = useRef<string>();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });

  const emailVerifiedCheck = async (): Promise<void> => {
    if (emailRef.current) {
      const res = await checkEmailVerified({ email: emailRef.current });
      if (res.data.verified) {
        navigation.navigate('AddInformation', { email: emailRef.current });
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

  const onSubmit = async ({ email }: { email: string }): Promise<void> => {
    emailRef.current = email;
    setLoading(true);
    try {
      await verifyEmail({ email });
      setNotification({ error: false, text: 'A verification link has been sent to your email' });
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  return (
    <Container size="small" scrollable>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <>
            <Fontisto style={styles.emailIcon} name="email" size={dpw(0.2)} color="black" />
            <Text align="center" style={{ marginBottom: dpw(0.02) }} size="heading" weight="bold">
              Enter your email
            </Text>
            <Text color="grey" style={{ marginBottom: dpw(0.05) }}>
              Enter your email below and well send you an email to verify it.
            </Text>
            <FormikTextInput
              returnKeyType="send"
              onSubmitEditing={(): void => handleSubmit()}
              name="email"
              placeholder="Email"
            />
            <Button
              style={{ marginBottom: dpw(0.03) }}
              loading={loading}
              onPress={handleSubmit}
              text="Send link"
            />
            <Notification error={notification.error} text={notification.text} />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default VerifyEmail;
