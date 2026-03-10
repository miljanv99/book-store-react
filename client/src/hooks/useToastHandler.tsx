import { ToastPosition, useToast } from '@chakra-ui/react';
import { HStack, Text, CloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export const useToastHandler = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const showToast = (
    message: string,
    status: 'success' | 'error' | 'warning',
    position?: ToastPosition,
    duration?: number,
    bookId?: string
  ) => {
    if (!toast.isActive(message)) {
      toast({
        id: message,
        position: position ? position : 'top',
        duration: duration ?? 3000,
        isClosable: true,
        render: ({ onClose }) => (
          <HStack
            p={3}
            _hover={bookId && { backgroundColor: 'orange.600' }}
            cursor={bookId && 'pointer'}
            bg={status === 'success' ? 'green.500' : status === 'error' ? 'red.500' : 'orange.500'}
            color="white"
            borderRadius="md"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => {
              bookId && (navigate(ROUTES.BOOK_DETAILS_DYNAMIC_PATH(bookId)), onClose());
            }}>
            <Text>{message}</Text>
            <CloseButton onClick={onClose} />
          </HStack>
        )
      });
    }
  };

  return showToast;
};
