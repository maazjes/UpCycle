import { Text as NativeText, StyleSheet, TextStyle } from 'react-native';

import theme from '../styles/theme';

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
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold
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
  ...props
}: {
  color?: 'secondary' | 'primary' | 'blue' | 'green';
  size?: 'subheading' | 'body';
  weight?: 'bold' | 'normal';
  align?: 'left' | 'center';
  style?: TextStyle;
  children?: string;
}): JSX.Element => {
  const textStyle = [
    styles.text,
    color === 'secondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    color === 'blue' && styles.blue,
    color === 'green' && styles.green,
    size === 'subheading' && styles.fontSizeSubheading,
    weight === 'bold' && styles.fontWeightBold,
    align === 'center' && styles.textAlignCenter,
    style
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
