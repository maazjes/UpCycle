import Button from 'components/Button';
import FormikTextInput from 'components/FormikTextInput';
import { Formik } from 'formik';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import * as yup from 'yup';
import { sendPasswordResetEmail } from 'services/passwordReset';
import { PasswordResetBody } from '@shared/types';
import Container from 'components/Container';
import Notification from 'components/Notification';
import Text from 'components/Text';
import { dph } from 'util/helpers';
import { Feather } from '@expo/vector-icons';
import { LoginStackScreen } from 'types';

const validationSchema = yup.object().shape({
  email: yup.string().email().required('Email is required')
});

const initialValues = {
  email: ''
};

const ResetPassword = ({ navigation }: LoginStackScreen<'ResetPassword'>): JSX.Element => {
  const onSubmit = async ({ email }: PasswordResetBody): Promise<void> => {
    try {
      await sendPasswordResetEmail({ email });
    } catch (e) {}
  };

  return (
    <Container scrollable size="small">
      <Feather
        style={{ alignSelf: 'center', marginBottom: dph(0.012) }}
        name="lock"
        size={80}
        color="black"
      />
      <Text align="center" size="heading" weight="bold" style={{ marginBottom: dph(0.012) }}>
        Trouble logging in?
      </Text>
      <Text align="center" color="grey" style={{ marginBottom: dph(0.03) }}>
        Enter your email below and well send you a link to reset your password
      </Text>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View>
            <FormikTextInput name="email" placeholder="Email" />
            <Notification />
            <Button
              style={{ marginTop: dph(0.02) }}
              onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Send link"
            />
          </View>
        )}
      </Formik>
      <Pressable onPress={(): void => navigation.navigate('SignUp')}>
        <Text
          style={{ marginTop: dph(0.03) }}
          align="center"
          size="subheading"
          weight="bold"
          color="green"
        >
          Sign up
        </Text>
      </Pressable>
    </Container>
  );
};

export default ResetPassword;
