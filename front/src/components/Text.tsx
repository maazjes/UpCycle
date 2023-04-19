import { Text as NativeText, StyleSheet, TextStyle, View } from 'react-native';

import theme from '../styles/theme';

interface TextProps {
  color?: 'secondary' | 'primary' | 'blue' | 'green' | 'red' | 'grey';
  size?: 'subheading' | 'body' | 'heading';
  weight?: 'bold' | 'normal';
  align?: 'left' | 'center';
  style?: TextStyle | TextStyle[];
  children?: string;
  padding?: boolean;
}

const styles = StyleSheet.create({
  text: {
    color: theme.textColors.primary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal
  },
  colorTextSecondary: {
    color: theme.textColors.secondary
  },
  colorPrimary: {
    color: theme.textColors.primary
  },
  blue: {
    color: theme.textColors.blue
  },
  green: {
    color: theme.textColors.green
  },
  red: {
    color: theme.textColors.red
  },
  grey: {
    color: theme.textColors.grey
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading
  },
  fontSizeHeading: {
    fontSize: theme.fontSizes.heading
  },
  fontWeightBold: {
    fontFamily: theme.fonts.bold
  },
  textAlignCenter: {
    textAlign: 'center'
  }
});

const Text = ({
  color = 'primary',
  size = 'body',
  weight = 'normal',
  align = 'left',
  style = {},
  padding = true,
  ...props
}: TextProps): JSX.Element => {
  const textStyle = [
    styles.text,
    color === 'secondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    color === 'blue' && styles.blue,
    color === 'green' && styles.green,
    color === 'red' && styles.red,
    color === 'grey' && styles.grey,
    size === 'subheading' && styles.fontSizeSubheading,
    size === 'heading' && styles.fontSizeHeading,
    weight === 'bold' && styles.fontWeightBold,
    align === 'center' && styles.textAlignCenter,
    style
  ];

  return padding ? (
    <NativeText style={textStyle} {...props} />
  ) : (
    <View
      style={[
        {
          justifyContent: 'center',
          height: theme.fontSizes[size] - 3
        },
        style
      ]}
    >
      <NativeText
        style={[
          textStyle,
          {
            marginVertical: -100000
          }
        ]}
        {...props}
      />
    </View>
  );
};

export default Text;
