import { View, StyleSheet, GestureResponderEvent, ScrollView, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppSelector } from 'hooks/redux';
import useNotification from 'hooks/useNotification';
import ProfilePhoto from 'components/ProfilePhoto';
import { dpw } from 'util/helpers';
import { updateUser } from 'services/users';
import { defaultProfilePhoto } from 'util/constants';
import { useState } from 'react';
import { ProfileProps, UserStackScreen } from '../types';
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
  email: yup.string().email().required('email is required'),
  username: yup
    .string()
    .min(2, 'Minimum length of name is 2')
    .max(15, 'Maximum length of name is 15')
    .required('username is required'),
  bio: yup
    .string()
    .min(1, 'Minimum length of name is 2')
    .max(150, 'Maximum length of name is 150')
    .required('username is required'),
  displayName: yup
    .string()
    .min(1, 'Minimum length of name is 2')
    .max(15, 'Maximum length of name is 15')
    .required('name is required')
});

const profileIcon = (uri: string): JSX.Element => <ProfilePhoto uri={uri} size={dpw(0.08)} />;

const EditProfile = ({ navigation, route }: UserStackScreen<'EditProfile'>): JSX.Element => {
  const notification = useNotification();
  const { id: currentUserId } = useAppSelector((state): ProfileProps => state.profileProps!);
  const [loading, setLoading] = useState(false);

  const { email, displayName, bio, username, photoUrl } = route.params;

  const initialValues = {
    email,
    displayName,
    bio,
    username,
    images: [{ uri: photoUrl }]
  };

  const onSubmit = async ({ images, ...params }: typeof initialValues): Promise<void> => {
    const image = images[0].uri !== initialValues.images[0].uri ? images[0] : { uri: null };
    (Object.keys(params) as Array<keyof Omit<typeof initialValues, 'images'>>).forEach(
      (key): void => {
        if (params[key] === initialValues[key]) {
          delete params[key];
        }
      }
    );
    if (!image.uri && Object.keys(params).length === 0) {
      return;
    }
    try {
      setLoading(true);
      const res = await updateUser(currentUserId, { ...params, image: image?.uri });
      const newUser = { ...route.params, ...res.data };
      if (image?.uri) {
        navigation
          .getParent()
          ?.setOptions({ tabBarIcon: (): JSX.Element => profileIcon(image.uri!) });
      }
      navigation.navigate('StackProfile', newUser);
    } catch (e) {
      setLoading(false);
      notification({
        message: e.message,
        error: false,
        modal: true
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <View style={styles.SignupForm}>
            <View style={styles.photo}>
              <FormikImageInput
                circle
                name="images"
                amount={1}
                initialImage={
                  <Image
                    style={{ width: dpw(0.3), height: dpw(0.3) }}
                    source={{
                      uri: defaultProfilePhoto
                    }}
                  />
                }
              />
            </View>
            <FormikTextInput style={styles.displayName} name="username" placeholder="Username" />
            <FormikTextInput name="displayName" placeholder="Display name" />
            <FormikTextInput name="email" placeholder="Email" />
            <FormikTextInput
              multiline
              textAlignVertical="top"
              style={styles.bioField}
              name="bio"
              placeholder="Bio"
            />
            <Button
              loading={loading}
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
