import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { dpw } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen, NewUserBody } from 'types';
import Text from 'components/Text';
import LinkedInputs from 'components/LinkedInputs';
import { Formik } from 'formik';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import { getUsers } from 'services/users';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';

const styles = StyleSheet.create({
  bioField: {
    height: dpw(0.3),
    paddingTop: dpw(0.05)
  }
});

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, 'Minimum length of name is 2')
    .max(15, 'Maximum length of name is 15')
    .required('Username is required')
    .test(
      'Test unique username',
      'Username already exists',
      async (value?: string): Promise<boolean> => {
        if (!value) {
          return true;
        }
        try {
          const res = await getUsers({ username: value });
          if (res.data.length > 0) {
            return false;
          }
        } catch {}
        return true;
      }
    ),
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

const AddInformation = ({ navigation, route }: LoginStackScreen<'AddInformation'>): JSX.Element => {
  const { email } = route.params;

  const initialValues = {
    displayName: '',
    username: '',
    bio: '',
    password: '',
    passwordConfirmation: '',
    images: []
  };

  const onSubmit = async ({
    password,
    username,
    ...values
  }: Omit<NewUserBody, 'email' | 'images'>): Promise<void> => {
    const userBody = {
      ...values,
      username,
      email,
      password,
      image: null
    };
    navigation.navigate('AddPhoto', userBody);
  };

  return (
    <KeyboardAvoidingView>
      <Container size="small" scrollable>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }): JSX.Element => (
            <>
              <Text style={{ marginBottom: dpw(0.05) }} align="center" size="heading">
                Enter your information
              </Text>
              <LinkedInputs>
                <FormikTextInput name="username" placeholder="Username" />
                <FormikTextInput name="displayName" placeholder="Display name" />
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
                  returnKeyType="send"
                  onSubmitEditing={(): void => handleSubmit()}
                />
              </LinkedInputs>
              <Button style={{ marginBottom: dpw(0.05) }} onPress={handleSubmit} text="Continue" />
            </>
          )}
        </Formik>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default AddInformation;
