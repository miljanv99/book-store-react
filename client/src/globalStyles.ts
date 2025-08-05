import { TextProps } from '@chakra-ui/react';
import { COLORS } from './globalColors';

export const buttonStyles = {
  color: 'black',
  borderRadius: 20,
  backgroundColor: COLORS.primaryColor,
  _hover: { backgroundColor: COLORS.darkPrimaryColor }
};

export const cardTextStyle: TextProps = {
  textAlign: 'center',
  fontSize: 'x-large'
};
