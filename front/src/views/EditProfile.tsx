import {
  View, StyleSheet, GestureResponderEvent, ScrollView
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { addUser } from 'reducers/userReducer';
import { TokenUser } from '@shared/types';
import useNotification from 'hooks/useNotification';
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

const EditProfile = ({ route, navigation }: UserStackScreen<'EditProfile'>): JSX.Element => {
  const error = useError();
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const currentUser = useAppSelector((state): TokenUser => state.user!);

  const {
    email, displayName, photoUrl, bio, username, id
  } = route.params;

  const initialValues = {
    email,
    displayName,
    bio,
    username,
    images: [{ uri: photoUrl }]
  };

  const onSubmit = async (
    { images, ...params }
    : typeof initialValues
  ): Promise<void> => {
    const image = images[0].uri !== initialValues.images[0].uri ? images[0] : undefined;
    (Object.keys(params) as Array<keyof Omit<typeof initialValues, 'images'>>).forEach((key): void => {
      if (params[key] === initialValues[key]) {
        delete params[key];
      }
    });
    try {
      const res = await updateUser(id, { ...params, image });
      dispatch(addUser({ ...currentUser, ...res.data }));
      navigation.goBack();
    } catch (e) {
      notification({ message: 'Failed updating your profile. Please try again', error: false, modal: false });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
              onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
              text="Save changes"
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditProfile;
