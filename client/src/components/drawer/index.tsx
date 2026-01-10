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
import { clearToken, selectAuthToken, selectUserData, setUserData } from '../../reducers/authSlice';
import { FC } from 'react';
import { matchPath, useNavigate } from 'react-router-dom';
import { useToastHandler } from '../../hooks/useToastHandler';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { ROUTES } from '../../constants/routes';

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
  const isAdmin = useSelector(selectUserData).isAdmin;

  const { colorMode, toggleColorMode } = useColorMode();

  const BUTTON_STYLE = {
    width: '150px',
    size: 'lg'
  };

  const handleSignOut = async () => {
    dispatch(clearToken());
    onDrawerClose();

    if (
      location.pathname === ROUTES.CART ||
      location.pathname === ROUTES.PROFILE ||
      location.pathname === ROUTES.USERS_LIST.USERS ||
      matchPath(ROUTES.USERS_LIST.USERS_LIST_FULL_PATH, location.pathname)
    ) {
      navigate(ROUTES.HOME, { replace: true });
    }

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
                {isAdmin && (
                  <>
                    <Button
                      {...BUTTON_STYLE}
                      onClick={() => {
                        navigate(ROUTES.USERS_LIST.USERS);
                        onDrawerClose();
                      }}>
                      Users List
                    </Button>
                    <Button
                      {...BUTTON_STYLE}
                      onClick={() => {
                        navigate(ROUTES.ANALYTICS);
                        onDrawerClose();
                      }}>
                      Analytics
                    </Button>
                  </>
                )}
                <Button {...BUTTON_STYLE} onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            )}
            {!token ? (
              <Button {...BUTTON_STYLE} onClick={onModalRegisterOpen}>
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
