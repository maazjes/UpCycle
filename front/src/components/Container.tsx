import { View, ViewProps, ScrollView, StyleSheet } from 'react-native';
import { dpw } from 'util/helpers';

interface ContainerProps extends ViewProps {
  scrollable?: boolean;
  size?: 'regular' | 'small';
  center?: boolean;
}

const styles = StyleSheet.create({
  base: {
    flexGrow: 1,
    padding: dpw(0.033)
  },
  small: {
    padding: dpw(0.05)
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Container = ({
  style,
  scrollable = false,
  size = 'regular',
  center = false,
  ...props
}: ContainerProps): JSX.Element => {
  const containerStyle = [
    styles.base,
    size === 'small' && styles.small,
    center && styles.center,
    style
  ];

  return scrollable ? (
    <ScrollView contentContainerStyle={containerStyle} {...props} />
  ) : (
    <View style={containerStyle} {...props} />
  );
};

export default Container;
