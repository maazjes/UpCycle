import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { dph, dpw } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen, NewUserBody } from 'types';
import Text from 'components/Text';
import LinkedInputs from 'components/LinkedInputs';
import { Formik } from 'formik';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
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

const AddInformation = ({ navigation, route }: LoginStackScreen<'AddInformation'>): JSX.Element => {
  const { email } = route.params;

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
    password,
    ...props
  }: Omit<NewUserBody, 'email' | 'images'>): Promise<void> => {
    const userBody = {
      ...props,
      email,
      password
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
              <Text style={{ marginBottom: 20 }} align="center" size="heading">
                Enter your information
              </Text>
              <LinkedInputs>
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
                  returnKeyType="send"
                  onSubmitEditing={(): void => handleSubmit()}
                />
              </LinkedInputs>
              <Button style={{ marginTop: dph(0.0) }} onPress={handleSubmit} text="Sign up" />
            </>
          )}
        </Formik>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default AddInformation;
