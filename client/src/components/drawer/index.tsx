import {
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerFooter,
  Switch,
  useColorMode
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, selectAuthToken, setUserData } from '../../reducers/authSlice';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastHandler } from '../../hooks/useToastHandler';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

interface DrawerProps {
  onModalSignInOpen: () => void;
  onModalRegisterOpen: () => void;
  onDrawerClose: () => void;
  isDrawerOpen: boolean;
}

const DrawerComponent: FC<DrawerProps> = ({
  onModalSignInOpen,
  onModalRegisterOpen,
  isDrawerOpen,
  onDrawerClose
}) => {
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToastHandler();

  const { colorMode, toggleColorMode } = useColorMode();

  const handleSignOut = async () => {
    dispatch(clearToken());
    onDrawerClose();
    location.pathname === '/cart'
      ? navigate('/')
      : location.pathname === '/profile'
        ? navigate('/')
        : () => {};

    dispatch(
      setUserData({
        _id: '',
        isAdmin: false,
        username: '',
        avatar: '',
        email: ''
      })
    );

    showToast('You successfully logged out', 'success');
  };

  return (
    <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <VStack spacing={6} justifyContent={'center'} alignItems={'center'} height={'100%'}>
            {!token ? (
              <Button width={'150px'} size={'lg'} onClick={onModalSignInOpen}>
                Sign In
              </Button>
            ) : (
              <>
                <Button
                  width={'150px'}
                  size={'lg'}
                  onClick={() => {
                    navigate('analytics');
                    onDrawerClose();
                  }}>
                  Analytics
                </Button>
                <Button width={'150px'} size={'lg'} onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            )}
            {!token ? (
              <Button width={'150px'} size={'lg'} onClick={onModalRegisterOpen}>
                Register
              </Button>
            ) : null}
          </VStack>
        </DrawerBody>
        <DrawerFooter justifyContent={'center'}>
          {colorMode === 'dark' ? (
            <SunIcon fontSize={35}></SunIcon>
          ) : (
            <MoonIcon fontSize={35}></MoonIcon>
          )}
          <Switch
            animation={'forwards'}
            size={'lg'}
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
            ml={5}></Switch>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
