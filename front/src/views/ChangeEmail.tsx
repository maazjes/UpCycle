import * as yup from 'yup';
import { dpw } from 'util/helpers';
import Container from 'components/Container';
import Text from 'components/Text';
import { Formik } from 'formik';
import { changeEmail, checkEmailVerified } from 'services/emails';
import { useEffect, useRef, useState } from 'react';
import Notification from 'components/Notification';
import { isAxiosError } from 'axios';
import { AppState } from 'react-native';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const validationSchema = yup.object().shape({
  email: yup.string().email('Must be a valid email address').required('Email is required')
});

const initialValues = {
  email: ''
};

const ChangeEmail = (): JSX.Element => {
  const appState = useRef(AppState.currentState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });
  const emailRef = useRef<string>();

  const emailVerifiedCheck = async (): Promise<boolean> => {
    if (emailRef.current) {
      const res = await checkEmailVerified({ email: emailRef.current });
      if (res.data.verified) {
        setNotification({ error: false, text: 'Your email has been successfully changed.' });
      }
    }
    return false;
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
      await changeEmail({ email });
      setNotification({
        error: false,
        text: 'A link to change your email has been sent to your email'
      });
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
            <Text align="center" style={{ marginBottom: dpw(0.04) }} size="heading" weight="bold">
              Enter a new email address
            </Text>
            <Text color="grey" style={{ marginBottom: dpw(0.05) }}>
              Enter a new email address below and well send you an email to verify it.
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

export default ChangeEmail;
