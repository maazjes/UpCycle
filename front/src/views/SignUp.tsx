import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TypedImage } from '@shared/types';
import { dpw } from 'util/helpers';
import Container from 'components/Container';
import { createUser } from '../services/users';
import useAuth from '../hooks/useAuth';
import useError from '../hooks/useError';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import FormikImageInput from '../components/FormikImageInput';

const styles = StyleSheet.create({
  bioField: {
    height: '20%',
    paddingTop: 13
  },
  bioAndPhoto: {
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
    marginTop: 10
  }

});

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, 'Minimum length of username is 1')
    .max(30, 'Maximum length of username is 30')
    .required('username is required'),
  displayName: yup
    .string()
    .min(5, 'Minimum length of name is 5')
    .max(10, 'Maximum length of name is 10')
    .required('name is required'),
  password: yup
    .string()
    .min(1, 'Minimum length of password is 1')
    .max(50, 'Maximum length of password is 4')
    .required('password is required'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('password confirmation is required')
});

const SignUp = (): JSX.Element => {
  const { login } = useAuth();
  const error = useError();

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
    images, email, password, ...props
  }: {
    email: string;
    displayName: string;
    username: string;
    bio: string;
    password: string;
    passwordConfirmation: string;
    images: TypedImage[];
  }): Promise<void> => {
    const image = images[0];
    try {
      await createUser({
        ...props, image, email, password
      });
      await login({ email, password });
    } catch (e) {
      error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <Container>
          <View style={styles.bioAndPhoto}>
            <FormikImageInput circle name="images" amount={1} />
            <View style={styles.emailAndUsername}>
              <FormikTextInput name="email" placeholder="Email" />
              <FormikTextInput style={styles.username} name="username" placeholder="Username" />
            </View>
          </View>
          <FormikTextInput style={styles.displayName} name="displayName" placeholder="Display name" />
          <FormikTextInput multiline textAlignVertical="top" style={styles.bioField} name="bio" placeholder="Bio" />
          <FormikTextInput secureTextEntry name="password" placeholder="Password" />
          <FormikTextInput secureTextEntry name="passwordConfirmation" placeholder="Password confirmation" />
          <Button
            onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Sign up"
          />
        </Container>
      )}
    </Formik>
  );
};

export default SignUp;
