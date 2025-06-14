import { ToastPosition, useToast } from '@chakra-ui/react';
import { HStack, Text, CloseButton } from '@chakra-ui/react';

export const useToastHandler = () => {
  const toast = useToast();

  const showToast = (message: string, status: 'success' | 'error', position?: ToastPosition) => {
    if (!toast.isActive(status)) {
      toast({
        id: status,
        position: position ? position : 'top',
        duration: 3000,
        isClosable: true,
        render: ({ onClose }) => (
          <HStack
            p={3}
            bg={status === 'success' ? 'green.500' : 'red.500'}
            color="white"
            borderRadius="md"
            justifyContent="space-between"
            alignItems="center">
            <Text>{message}</Text>
            <CloseButton onClick={onClose} />
          </HStack>
        )
      });
    }
  };

  return showToast;
};
