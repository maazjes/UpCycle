import { Text as NativeText, StyleSheet, TextStyle } from 'react-native';

import theme from '../styles/theme';

const styles = StyleSheet.create({
  text: {
    color: theme.textColors.textPrimary,
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
  color?: 'textSecondary' | 'primary' | '';
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
