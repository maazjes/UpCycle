import { ScrollView, ScrollViewProps } from 'react-native';
import { isCloseToBottom } from 'util/helpers';

interface GridViewProps extends ScrollViewProps {
  onEndReached: () => Promise<void>;
}

const Scrollable = ({ onEndReached, ...props }: GridViewProps): JSX.Element => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    onScroll={({ nativeEvent }): void => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
        onEndReached();
      }
    }}
    {...props}
  />
);

export default Scrollable;
