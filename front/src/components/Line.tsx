import { StyleSheet, View, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  line: {
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth
  }
});

const Line = ({ style, ...props }: ViewProps): JSX.Element => (
  <View style={[styles.line, style]} {...props} />
);

export default Line;
