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
import { setCartCounter, setCartItems } from '../../reducers/cartSlice';
import { useToastHandler } from '../../hooks/useToastHandler';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { User } from '../../model/User.model';
import { Cart } from '../../model/Cart.model';
import { Book } from '../../model/Book.model';

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
  const getCartItems = useApi<ApiResponse<Cart>>();

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

    if (response) {
      try {
        const token = response.data.data;
        dispatch(setToken(token));
        console.log('Token after login:', token);
        const [profileResponse, cartSizeResponse, cartItems] = await Promise.all([
          await userProfile({
            method: 'GET',
            url: API_ROUTES.getProfile(credentials.username)
          }),

          await getCartSize({
            method: 'GET',
            url: API_ROUTES.getCartSize
          }),

          await getCartItems({
            method: 'GET',
            url: API_ROUTES.getCartItems
          })
        ]);

        const cartItemsBooks: Book[] = cartItems && cartItems.data.data.books;
        const cartItemsBookId: string[] = [];
        for (const book of cartItemsBooks) {
          cartItemsBookId.push(book._id);
        }

        dispatch(setCartItems(cartItemsBookId));
        console.log('PPPPPP: ', cartItemsBookId);

        dispatch(setCartCounter(cartSizeResponse && cartSizeResponse.data.data));

        const { id, isAdmin, username, avatar, email } = profileResponse?.data.data!;
        dispatch(setUserData({ id, isAdmin, username, avatar, email }));
        handleCloseSignInModal();
        onDrawerClose();
        console.log('Toast message', response.data.message);
      } catch (error) {
        console.log(error);
      }
      showToast(response.data.message, response.status === 200 ? 'success' : 'error');
    } else {
      console.error(response);
    }
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
