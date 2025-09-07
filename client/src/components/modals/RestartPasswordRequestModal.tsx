import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Input,
  ModalFooter,
  Button,
  HStack
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { buttonStyles } from '../../globalStyles';
import { useApi } from '../../hooks/useApi';
import { API_ROUTES } from '../../constants/apiConstants';
import { emailRegex } from '../../constants/regex';
import { useToastHandler } from '../../hooks/useToastHandler';

type RestartPasswordProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const RestartPasswordRequestModal: FC<RestartPasswordProps> = ({ closeModal, isModalOpen }) => {
  const [email, setEmail] = useState<string>('');
  const requestPasswordReset = useApi();
  const toast = useToastHandler();

  const sendRequest = async (email: string) => {
    const isValid = emailRegex.test(email);

    if (isValid) {
      const response = await requestPasswordReset({
        method: 'POST',
        url: API_ROUTES.authRequestRestartPassword,
        data: {
          email: email
        }
      });

      if (response && response.status === 200) {
        window.open(response.data.data, '_blank');
        closeModal();
      } else {
        console.log(response);
        toast(response && response.data.message, 'error', 'bottom');
      }
    } else {
      toast('You entered invalid email. Please try again!', 'error', 'bottom');
    }
  };

  return (
    <Modal isCentered={true} isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Please Enter Your Email Address</ModalHeader>
        <ModalBody>
          <Stack spacing={8}>
            <Input
              name="email"
              variant="flushed"
              placeholder="Enter email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              {...buttonStyles}
              isDisabled={!email}
              onClick={() => {
                sendRequest(email);
              }}>
              Send
            </Button>
            <Button {...buttonStyles} onClick={closeModal}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RestartPasswordRequestModal;
