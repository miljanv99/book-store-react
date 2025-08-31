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
  HStack,
  Icon,
  VStack,
  Text,
  Center
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { buttonStyles } from '../../globalStyles';
import { useApi } from '../../hooks/useApi';
import { API_ROUTES } from '../../constants/apiConstants';
import { emailRegex } from '../../constants/regex';
import { useToastHandler } from '../../hooks/useToastHandler';
import { CheckCircleIcon } from '@chakra-ui/icons';

type RestartPasswordProps = {
  isModalOpen: boolean;
  closeModal: () => void;
};

const RestartPasswordRequestModal: FC<RestartPasswordProps> = ({ closeModal, isModalOpen }) => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<number>();
  const requestPasswordReset = useApi();
  const toast = useToastHandler();

  const sendRequest = async (email: string) => {
    const isValid = emailRegex.test(email);

    if (isValid) {
      const response = await requestPasswordReset({
        method: 'POST',
        url: API_ROUTES.requestRestartPassword,
        data: {
          email: email
        }
      });

      if (response && response.status === 200) {
        setStatus(response.status);
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
      {!status ? (
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
      ) : (
        <ModalContent>
          <ModalHeader textAlign={'center'}>You Successfully Sent Request</ModalHeader>
          <ModalBody>
            <VStack>
              <Icon as={CheckCircleIcon} color={'green'} boxSize={12}></Icon>
              <Text>Please Check Your Email</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Center w={'100vw'}>
              <Button {...buttonStyles} onClick={closeModal}>
                Close
              </Button>
            </Center>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default RestartPasswordRequestModal;
