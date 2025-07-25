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
import { useDispatch, useSelector } from 'react-redux';
import { setCartCounter } from '../../reducers/cartSlice';
import { useToastHandler } from '../../hooks/useToastHandler';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { User } from '../../model/User.model';

interface SignProps {
  isModalSignInOpen: boolean;
  onModalSignInClose: () => void;
  onDrawerClose: () => void;
}

const SignInModal: FC<SignProps> = ({ isModalSignInOpen, onModalSignInClose, onDrawerClose }) => {
  const dispatch = useDispatch();
  const showToast = useToastHandler();
  const profileData = useSelector(selectUserData);
  const userLogin = useApi<ApiResponse<string>>();
  const userProfile = useApi<ApiResponse<User>>();
  const getCartSize = useApi<ApiResponse<number>>();

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
    const response = await userLogin({
      method: 'POST',
      url: API_ROUTES.login,
      data: { username: credentials.username, password: credentials.password }
    });

    if (response?.status! === 200) {
      console.log(response?.data.message);
      const token = response?.data.data!;
      dispatch(setToken(token));
      console.log('Token after login:', token);
      const profileResponse = await userProfile({
        method: 'GET',
        url: API_ROUTES.getProfile(credentials.username),
        headers: { Authorization: `Bearer ${token}` }
      });
      const cartSizeResponse = await getCartSize({
        method: 'GET',
        url: API_ROUTES.getCartSize,
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch(setCartCounter(cartSizeResponse?.data.data));

      const { isAdmin, username, avatar } = profileResponse?.data.data!;
      dispatch(setUserData({ isAdmin, username, avatar }));
      handleCloseSignInModal();
      onDrawerClose();
    }

    console.log('Toast message', response?.data.message);

    showToast(response?.data.message!, response?.status === 200 ? 'success' : 'error');
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
              type="password"
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
