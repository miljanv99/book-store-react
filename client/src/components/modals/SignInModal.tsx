import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Input,
  ModalFooter,
  Button
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { selectUserData, setToken, setUserData } from '../../reducers/authSlice';
import { userLogin, userProfile } from '../../services/User';
import { useDispatch, useSelector } from 'react-redux';
import { getCartSize } from '../../services/Cart';
import { setCartCounter } from '../../reducers/cartSlice';
import { useToastHandler } from '../../hooks/useToastHandler';

interface SignProps {
  isModalSignInOpen: boolean;
  onModalSignInClose: () => void;
  onDrawerClose: () => void;
}

const SignInModal: FC<SignProps> = ({ isModalSignInOpen, onModalSignInClose, onDrawerClose }) => {
  const dispatch = useDispatch();
  const showToast = useToastHandler();
  const profileData = useSelector(selectUserData);

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

  const handleLogin = async () => {
    console.log(credentials.username + ' ' + credentials.password);
    let response = await userLogin(credentials.username, credentials.password);
    if (response!.status === 200) {
      console.log(response!.data.message);
      const token = response?.data['data'];
      dispatch(setToken(token));
      console.log('Token after login:', token);
      const profileResponse = await userProfile(token, credentials.username);
      const cartSizeResponse = await getCartSize(token);
      dispatch(setCartCounter(cartSizeResponse?.data['data']));

      const { isAdmin, username, avatar } = profileResponse!.data['data'];
      dispatch(setUserData({ isAdmin, username, avatar }));
      handleCloseSignInModal();
      onDrawerClose();
    }
    showToast(response?.data['message'], response?.status === 200 ? 'success' : 'error');
  };

  useEffect(() => {
    if (credentials.username === '' || credentials.password === '') {
      setDisableSignBtn(true);
    }
  }, [credentials]);

  useEffect(() => {
    console.log('Updated Profile Data:', profileData);
  }, [profileData]);

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
