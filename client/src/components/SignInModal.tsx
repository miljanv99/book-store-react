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
  CloseButton,
  HStack,
  useToast,
  Text
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { setToken } from '../reducers/authSlice';
import { userLogin } from '../services/User';
import { useDispatch } from 'react-redux';

interface SignProps {
  isModalSignInOpen: boolean;
  onModalSignInClose: () => void;
  onDrawerClose: () => void;
}
type ToastIdType = 'login_result_success' | 'login_result_fail';

const SignInModal: FC<SignProps> = ({ isModalSignInOpen, onModalSignInClose, onDrawerClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [disableSignBtn, setDisableSignBtn] = useState(true);

  const handleCloseSignInModal = () => {
    onModalSignInClose();
    setCredentials({ username: '', password: '' });
  };

  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }));

    if (credentials.username !== null && credentials.password !== null) {
      setDisableSignBtn(false);
    }
  };

  const showLoginToast = (toastIdType: ToastIdType) => {
    const toastId = toastIdType;
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        position: 'top',
        duration: 3000,
        isClosable: true,
        render: ({ onClose }) => (
          <HStack
            p={3}
            bg={toastIdType === 'login_result_fail' ? 'red.500' : 'green.500'}
            color="white"
            borderRadius="md"
            justifyContent="space-between"
            alignItems="center">
            {toastIdType === 'login_result_fail' ? (
              <Text>You've entered invalid username or password</Text>
            ) : (
              <Text>You successfully logged in</Text>
            )}
            <CloseButton onClick={onClose} />
          </HStack>
        )
      });
    }
  };

  const handleLogin = async () => {
    console.log(credentials.username + ' ' + credentials.password);
    let response = await userLogin(credentials.username, credentials.password);
    if (response!.status === 200) {
      console.log(response!.data.message);
      const token = response?.data['data'];
      dispatch(setToken(token));
      console.log('Token after login:', token);
      handleCloseSignInModal();
      onDrawerClose();
      toast.isActive('login_result_fail')
        ? toast.close('login_result_fail')
        : (() => {
            console.log('Failed login toast not active');
          })();
      showLoginToast('login_result_success');
    } else {
      showLoginToast('login_result_fail');
      console.log('Login Failed');
    }
  };

  useEffect(() => {
    if (credentials.username === '' || credentials.password === '') {
      setDisableSignBtn(true);
    }
  }, [credentials]);

  return (
    <Modal isCentered={true} isOpen={isModalSignInOpen} onClose={handleCloseSignInModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Sign In</ModalHeader>
        <ModalBody>
          <Stack spacing={8}>
            <Input
              name="username"
              onChange={handleCredentials}
              variant="flushed"
              placeholder="Username"
            />
            <Input
              name="password"
              onChange={handleCredentials}
              variant="flushed"
              placeholder="Password"
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} colorScheme="blue" isDisabled={disableSignBtn} onClick={handleLogin}>
            Sign In
          </Button>
          <Button variant="ghost" onClick={handleCloseSignInModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignInModal;
