import * as yup from 'yup';
import { dph } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen, NewUserBody } from 'types';
import FormikImageInput from 'components/FormikImageInput';
import { Formik } from 'formik';
import { createUser } from 'services/users';
import { useState } from 'react';
import Text from 'components/Text';
import Button from '../components/Button';

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

const AddPhoto = ({ navigation, route }: LoginStackScreen<'AddPhoto'>): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    images: []
  };

  const onSubmit = async ({ images }: Pick<NewUserBody, 'images'>): Promise<void> => {
    const image = images[0]?.uri ?? null;
    setLoading(true);
    try {
      await createUser({ ...route.params, image });
      navigation.navigate('Login');
    } catch {}
    setLoading(false);
  };

  return (
    <Container size="small" scrollable>
      <Text size="heading" weight="bold" align="center">
        Add a profile photo
      </Text>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <>
            <FormikImageInput
              containerStyle={{ marginVertical: dph(0.04) }}
              size={150}
              circle
              name="images"
              amount={1}
            />
            <Button loading={loading} onPress={handleSubmit} text="Sign up" />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default AddPhoto;
