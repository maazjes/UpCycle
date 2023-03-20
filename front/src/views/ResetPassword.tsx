import Button from 'components/Button';
import FormikTextInput from 'components/FormikTextInput';
import { Formik } from 'formik';
import { GestureResponderEvent, View } from 'react-native';
import * as yup from 'yup';
import { sendPasswordResetEmail } from 'services/passwordReset';
import { EmailBody } from '@shared/types';
import Container from 'components/Container';
import Notification from 'components/Notification';
import useNotification from 'hooks/useNotification';
import useError from 'hooks/useError';

const validationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required')
});

const initialValues = {
  email: ''
};

const ResetPassword = (): JSX.Element => {
  const notification = useNotification();
  const error = useError();

  const onSubmit = async ({ email }: EmailBody): Promise<void> => {
    try {
      await sendPasswordResetEmail({ email });
      notification({
        message: 'password reset link sent to your email',
        error: false,
        modal: false
      });
    } catch (e) {
      notification({
        message: 'user not found with this email address',
        error: true,
        modal: false
      });
    }
  };

  return (
    <Container style={{ justifyContent: 'center' }}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View>
            <FormikTextInput name="email" placeholder="Email" />
            <Button
              onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Submit"
            />
          </View>
        )}
      </Formik>
      <Notification />
    </Container>
  );
};

export default ResetPassword;
