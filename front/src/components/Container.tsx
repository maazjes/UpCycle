import { View, ViewProps, ScrollView } from 'react-native';
import { dpw } from 'util/helpers';

interface Props extends ViewProps {
  scrollable?: boolean;
  size?: 'regular' | 'small';
  center?: boolean;
}

const Container = ({
  style,
  scrollable = false,
  size = 'regular',
  center = false,
  ...props
}: Props): JSX.Element =>
  scrollable ? (
    <ScrollView
      contentContainerStyle={[
        { flexGrow: 1, padding: '2.5%' },
        size === 'small' && { padding: '5%' },
        center && { alignItems: 'center', justifyContent: 'center' },
        style
      ]}
      {...props}
    />
  ) : (
    <View
      style={[
        { flex: 1, padding: dpw(0.1 / 3) },
        size === 'small' && { padding: '5%' },
        center && { alignItems: 'center', justifyContent: 'center' },
        style
      ]}
      {...props}
    />
  );

export default Container;
