import * as yup from 'yup';
import { dpw } from 'util/helpers';
import Container from 'components/Container';
import Text from 'components/Text';
import { Formik } from 'formik';
import { useState } from 'react';
import Notification from 'components/Notification';
import { isAxiosError } from 'axios';
import { changePassword } from 'services/passwords';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Minimum length of password is 6')
    .max(20, 'Maximum length of password is 20')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required')
});

const initialValues = {
  password: '',
  passwordConfirmation: ''
};

const ChangePassword = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });

  const onSubmit = async ({ password }: { password: string }): Promise<void> => {
    setLoading(true);
    try {
      await changePassword({ password });
      setNotification({
        error: false,
        text: 'Your password has been changed successfully.'
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
              Enter a new password
            </Text>
            <Text color="grey" style={{ marginBottom: dpw(0.05) }}>
              Enter a new email address below and well send you an email to verify it.
            </Text>
            <FormikTextInput secureTextEntry name="password" placeholder="Password" />
            <FormikTextInput
              secureTextEntry
              name="passwordConfirmation"
              placeholder="Password confirmation"
              returnKeyType="send"
              onSubmitEditing={(): void => handleSubmit()}
            />
            <Button
              style={{ marginBottom: dpw(0.03) }}
              loading={loading}
              onPress={handleSubmit}
              text="Save password"
            />
            <Notification error={notification.error} text={notification.text} />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ChangePassword;
