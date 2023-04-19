import { dpw } from 'util/helpers';
import Container from 'components/Container';
import { LoginStackScreen, NewUserBody } from 'types';
import FormikImageInput from 'components/FormikImageInput';
import { Formik } from 'formik';
import { createUser } from 'services/users';
import { useRef, useState } from 'react';
import Text from 'components/Text';
import { isAxiosError } from 'axios';
import { TouchableOpacity } from 'react-native';
import Notification from 'components/Notification';
import Button from '../components/Button';

const AddPhoto = ({ navigation, route }: LoginStackScreen<'AddPhoto'>): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, text: '' });
  const skipped = useRef(false);

  const initialValues = {
    images: []
  };

  const onSubmit = async ({ images }: Pick<NewUserBody, 'images'>): Promise<void> => {
    const image = images[0]?.uri ?? null;
    if (!skipped.current) {
      setLoading(true);
    }
    try {
      await createUser({ ...route.params, image });
      navigation.navigate('Login');
    } catch (e) {
      if (isAxiosError(e)) {
        setNotification({ error: true, text: e.message });
      }
    }
    setLoading(false);
  };

  return (
    <Container size="small" scrollable>
      <Text size="heading" weight="bold" align="center">
        Add a profile photo
      </Text>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit }): JSX.Element => (
          <>
            <FormikImageInput
              containerStyle={{ marginVertical: dpw(0.07) }}
              size={dpw(0.4)}
              circle
              name="images"
              amount={1}
              maxAmount={1}
            />
            <Button
              style={{ marginBottom: dpw(0.06) }}
              loading={loading}
              onPress={handleSubmit}
              text="Sign up"
            />
            <TouchableOpacity
              onPress={(): void => {
                skipped.current = true;
                handleSubmit();
              }}
            >
              <Text size="subheading" align="center">
                Skip
              </Text>
              <Notification
                style={{ marginTop: dpw(0.03) }}
                error={notification.error}
                text={notification.text}
              />
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default AddPhoto;
