import { View, ViewProps } from 'react-native';

const Container = ({ style, ...props }: ViewProps): JSX.Element => (
  <View style={[{ flex: 1, padding: '4.5%' }, style]} {...props} />
);

export default Container;
