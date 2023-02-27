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
    color: theme.textColors.textSecondary
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
  }
});

const Text = ({
  color = '',
  fontSize = 'body',
  fontWeight = 'normal',
  style = {},
  ...props
}: {
  color?: 'textSecondary' | 'primary' | 'blue' | 'green' | '';
  fontSize?: 'subheading' | 'body';
  fontWeight?: 'bold' | 'normal';
  style?: TextStyle;
  children?: string;
}): JSX.Element => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    color === 'blue' && styles.blue,
    color === 'green' && styles.green,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
