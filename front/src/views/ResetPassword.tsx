import Button from 'components/Button';
import FormikTextInput from 'components/FormikTextInput';
import { Formik } from 'formik';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import * as yup from 'yup';
import { sendPasswordResetEmail } from 'services/passwords';
import { EmailBody } from '@shared/types';
import Container from 'components/Container';
import Notification from 'components/Notification';
import Text from 'components/Text';
import { dpw } from 'util/helpers';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { isAxiosError } from 'axios';

const validationSchema = yup.object().shape({
  email: yup.string().email('Must be a valid email address').required('Email is required')
});

const initialValues = {
  email: ''
};

const styles = StyleSheet.create({
  lockIcon: {
    alignSelf: 'center',
    marginBottom: dpw(0.02)
  }
});

const ResetPassword = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });

  const onSubmit = async ({ email }: EmailBody): Promise<void> => {
    setLoading(true);
    try {
      await sendPasswordResetEmail({ email });
      setNotification({ error: false, text: 'A password reset link has been sent to your email' });
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  return (
    <Container scrollable size="small">
      <Feather style={styles.lockIcon} name="lock" size={dpw(0.2)} color="black" />
      <Text align="center" size="heading" weight="bold" style={{ marginBottom: dpw(0.02) }}>
        Trouble logging in?
      </Text>
      <Text align="center" color="grey" style={{ marginBottom: dpw(0.05) }}>
        Enter your email below and well send you a link to reset your password
      </Text>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View>
            <FormikTextInput
              returnKeyType="send"
              onSubmitEditing={(): void => handleSubmit()}
              name="email"
              placeholder="Email"
            />
            <Button
              style={{ marginBottom: dpw(0.03) }}
              loading={loading}
              onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Send link"
            />
            <Notification error={notification.error} text={notification.text} />
          </View>
        )}
      </Formik>
    </Container>
  );
};

export default ResetPassword;
