import { View, StyleSheet } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  loginForm: {
    justifyContent: 'center',
    margin: 12,
    marginTop: 100
  },
  signUp: {
    marginTop: 10,
    alignItems: 'center'
  }
});

const Message = ({ content }: { content: string }): JSX.Element => <View
>
