import {
  View, StyleSheet, GestureResponderEvent
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { UserStackScreen } from '../types';
import { updateUser } from '../services/users';
import useError from '../hooks/useError';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import FormikImageInput from '../components/FormikImageInput';

const styles = StyleSheet.create({
  SignupForm: {
    margin: 12
  },
  bioField: {
    height: 100,
    paddingTop: 13
  },
  photo: {
    justifyContent: 'center',
    marginTop: 10
  },
  displayName: {
    marginTop: 20
  }
});

const validationSchema = yup.object().shape({
  displayName: yup
    .string()
    .min(5, 'Minimum length of name is 5')
    .max(10, 'Maximum length of name is 10')
    .required('name is required')
});

const EditProfile = ({ route }: UserStackScreen<'EditProfile'>): JSX.Element => {
  const error = useError();
  const {
    email, displayName, photoUrl, bio, username
  } = route.params;

  const initialValues = {
    email,
    displayName,
    bio,
    username,
    images: [{ uri: photoUrl }]
  };

  type EditProfileProps = typeof initialValues;

  const onSubmit = async (
    { images, ...props }
    : EditProfileProps
  ): Promise<void> => {
    const image = images[0].uri !== initialValues.images[0].uri ? images[0] : undefined;
    (Object.keys(props) as Array<keyof Omit<EditProfileProps, 'images'>>).forEach((key): void => {
      if (props[key] === initialValues[key]) {
        delete props[key];
      }
    });
    try {
      await updateUser({ ...props, image });
    } catch (e) {
      error(e);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ handleSubmit }): JSX.Element => (
        <View style={styles.SignupForm}>
          <View style={styles.photo}>
            <FormikImageInput circle name="images" amount={1} />
          </View>
          <FormikTextInput style={styles.displayName} name="username" placeholder="Username" />
          <FormikTextInput name="displayName" placeholder="Display name" />
          <FormikTextInput name="email" placeholder="Email" />
          <FormikTextInput multiline textAlignVertical="top" style={styles.bioField} name="bio" placeholder="Bio" />
          <Button
            onSubmit={handleSubmit as unknown as (event: GestureResponderEvent) => void}
            text="Save changes"
          />
        </View>
      )}
    </Formik>
  );
};

export default EditProfile;
