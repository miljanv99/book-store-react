import { TextProps } from '@chakra-ui/react';
import { COLORS } from './globalColors';

export const buttonStyles = {
  cursor: 'pointer',
  color: 'black',
  borderRadius: 20,
  backgroundColor: COLORS.primaryColor,
  _hover: { backgroundColor: COLORS.darkPrimaryColor },
  _active: { backgroundColor: COLORS.darkerPrimaryColor }
};

export const cardTextStyle: TextProps = {
  textAlign: 'center',
  fontSize: 'x-large'
};
