import { Text as NativeText, StyleSheet, TextStyle } from 'react-native';

import theme from '../styles/theme';

const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary
  },
  colorPrimary: {
    color: theme.colors.primary
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold
  }
});

const Text = ({
  color = 'primary',
  fontSize = 'body',
  fontWeight = 'normal',
  style = {},
  ...props
}: {
  color?: 'textSecondary' | 'primary';
  fontSize?: 'subheading' | 'body';
  fontWeight?: 'bold' | 'normal';
  style?: TextStyle;
  children: string;
}): JSX.Element => {
  const textStyle = [
    styles.text,
    color === 'textSecondary' && styles.colorTextSecondary,
    color === 'primary' && styles.colorPrimary,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style
  ];

  return <NativeText style={textStyle} {...props} />;
};

export default Text;
