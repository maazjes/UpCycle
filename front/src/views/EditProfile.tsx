import { View, StyleSheet, GestureResponderEvent, ScrollView, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ProfilePhoto from 'components/ProfilePhoto';
import { dpw } from 'util/helpers';
import { getUsers, updateUser } from 'services/users';
import { defaultProfilePhoto } from 'util/constants';
import { useRef, useState } from 'react';
import LinkedInputs from 'components/LinkedInputs';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import { editUser } from 'reducers/profileUser';
import Notification from 'components/Notification';
import { isAxiosError } from 'axios';
import Container from 'components/Container';
import { UserScreen } from '../types';
import FormikTextInput from '../components/FormikTextInput';
import Button from '../components/Button';
import FormikImageInput from '../components/FormikImageInput';

const styles = StyleSheet.create({
  bioField: {
    height: dpw(0.3),
    paddingTop: dpw(0.05)
  },
  photo: {
    justifyContent: 'center'
  },
  displayName: {
    marginTop: dpw(0.033)
  },
  initialImage: {
    width: dpw(0.3),
    height: dpw(0.3)
  }
});

const profileIcon = (uri: string): JSX.Element => <ProfilePhoto uri={uri} size={dpw(0.08)} />;

const EditProfile = ({ navigation, route }: UserScreen<'EditProfile'>): JSX.Element => {
  const currentUser = useRef({
    ...route.params,
    images: route.params.photoUrl ? [{ uri: `${route.params.photoUrl}_100x100?alt=media` }] : [],
    photoUrl: undefined
  });
  const currentUserId = useAppSelector((state): string => state.currentUserId!);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });
  const dispatch = useAppDispatch();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required('email is required'),
    username: yup
      .string()
      .min(2, 'Minimum length of username is 2')
      .max(15, 'Maximum length of username is 30')
      .required('Username is required')
      .test(
        'Test unique username',
        'Username already exists',
        async (value?: string): Promise<boolean> => {
          if (!value || value === currentUser.current.username) {
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
      .min(1, 'Minimum length of bio is 2')
      .max(150, 'Maximum length of bio is 150')
      .required('username is required'),
    displayName: yup
      .string()
      .min(1, 'Minimum length of display name is 2')
      .max(15, 'Maximum length of display name is 30')
      .required('name is required')
  });

  const onSubmit = async ({ images, ...params }: typeof currentUser.current): Promise<void> => {
    const image = images[0].uri !== currentUser.current.images[0]?.uri ? images[0] : { uri: null };
    (Object.keys(params) as Array<keyof Omit<typeof currentUser.current, 'images'>>).forEach(
      (key): void => {
        if (params[key] === currentUser.current[key]) {
          delete params[key];
        }
      }
    );
    if (!image.uri && Object.keys(params).length === 0) {
      return;
    }
    setLoading(true);
    try {
      const res = await updateUser(currentUserId, { ...params, image: image?.uri });
      dispatch(editUser(res.data));
      if (image?.uri) {
        navigation
          .getParent()
          ?.setOptions({ tabBarIcon: (): JSX.Element => profileIcon(image.uri!) });
      }
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Formik
          initialValues={currentUser.current}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }): JSX.Element => (
            <Container>
              <View style={styles.photo}>
                <FormikImageInput
                  circle
                  name="images"
                  amount={1}
                  maxAmount={1}
                  initialImage={
                    <Image
                      style={styles.initialImage}
                      source={{
                        uri: defaultProfilePhoto,
                        cache: 'force-cache'
                      }}
                    />
                  }
                />
              </View>
              <LinkedInputs>
                <FormikTextInput
                  style={styles.displayName}
                  name="username"
                  placeholder="Username"
                />
                <FormikTextInput name="displayName" placeholder="Display name" />
                <FormikTextInput name="email" placeholder="Email" />
                <FormikTextInput
                  multiline
                  textAlignVertical="top"
                  style={styles.bioField}
                  name="bio"
                  placeholder="Bio"
                  returnKeyType="send"
                  onSubmitEditing={(): void => handleSubmit()}
                />
              </LinkedInputs>
              <Button
                loading={loading}
                onPress={handleSubmit as unknown as (event: GestureResponderEvent) => void}
                text="Save changes"
              />
              <Notification text={notification.text} error={notification.error} />
            </Container>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
