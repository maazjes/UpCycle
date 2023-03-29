import { StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TypedImage } from '@shared/types';
import { dph, dpw } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen } from 'types';
import FormikImageInput from 'components/FormikImageInput';
import Text from 'components/Text';
import { Fontisto } from '@expo/vector-icons';
import LinkedInputs from 'components/LinkedInputs';
import { createUser } from '../services/users';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  bioField: {
    height: 100,
    paddingTop: 13,
    flex: 1
  },
  photo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emailAndUsername: {
    flexDirection: 'column',
    width: dpw(0.55)
  },
  username: {
    marginBottom: 0
  },
  displayName: {
    marginTop: 0
  }
});

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

const SignUp = ({ navigation, route }: LoginStackScreen<'SignUp'>): JSX.Element => {
  const { login } = useAuth();
  const error = useError();
  const { nextPage } = route.params || false;

  const initialValues = {
    email: '',
    displayName: '',
    username: '',
    bio: '',
    password: '',
    passwordConfirmation: '',
    images: []
  };

  const onSubmit = async ({
    images,
    email,
    password,
    ...props
  }: {
    email: string;
    displayName: string;
    username: string;
    bio: string;
    password: string;
    passwordConfirmation: string;
    images: TypedImage[];
  }): Promise<void> => {
    try {
      console.log(props);
      await createUser({
        ...props,
        image: images[0]?.uri ?? null,
        email,
        password
      });
      await login({ email, password });
    } catch (e) {
      error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <Container size="small" scrollable>
          <>
            <Fontisto
              style={{ marginBottom: dph(0.012), alignSelf: 'center' }}
              name="email"
              size={70}
              color="black"
            />
            <Text align="center" style={{ marginBottom: dph(0.012) }} size="heading" weight="bold">
              Enter your email
            </Text>
            <Text color="grey" style={{ marginBottom: dph(0.03) }}>
              Enter your email below and well send you an email to verify your account.
            </Text>
            <FormikTextInput name="email" placeholder="Email" />
            <Button
              style={{ marginTop: dph(0.02) }}
              onPress={(): void => {
                navigation.push('SignUp', { nextPage: true });
              }}
              text="Next"
            />
          </>
          <>
            <LinkedInputs>
              <FormikImageInput
                containerStyle={{ marginBottom: dph(0.02) }}
                circle
                name="images"
                amount={1}
              />
              <FormikTextInput name="username" placeholder="Username" />
              <FormikTextInput
                style={styles.displayName}
                name="displayName"
                placeholder="Display name"
              />
              <FormikTextInput
                multiline
                blurOnSubmit
                textAlignVertical="top"
                style={styles.bioField}
                name="bio"
                placeholder="Bio"
              />
              <FormikTextInput secureTextEntry name="password" placeholder="Password" />
              <FormikTextInput
                secureTextEntry
                name="passwordConfirmation"
                placeholder="Password confirmation"
              />
            </LinkedInputs>
            <Button
              style={{ marginTop: dph(0.0) }}
              onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Sign up"
            />
          </>
        </Container>
      )}
    </Formik>
  );
};

export default SignUp;
