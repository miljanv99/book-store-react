import {
  Box,
  useDisclosure,
  Flex,
  Link,
  Wrap,
  WrapItem,
  IconButton,
  Avatar,
  Spinner,
  Circle
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { COLORS } from '../globalColors';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import SignInModal from './modals/SignInModal';
import RegisterModal from './modals/RegisterModal';
import DrawerComponent from './drawer';
import { useEffect, useState } from 'react';
import { selectCartCounter } from '../reducers/cartSlice';

const Navigation = () => {
  const token = useSelector(selectAuthToken);

  // Drawer state
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const userProfileData = useSelector(selectUserData);
  const cartCounter = useSelector(selectCartCounter);

  // Modal state sign
  const {
    isOpen: isModalSignInOpen,
    onOpen: onModalSignInOpen,
    onClose: onModalSignInClose
  } = useDisclosure();

  // Modal state register
  const {
    isOpen: isModalRegisterOpen,
    onOpen: onModalRegisterOpen,
    onClose: onModalRegisterClose
  } = useDisclosure();

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Box w={'100%'} h={20} bg={COLORS.primaryColor} px={4} position={'fixed'} zIndex={10}>
        <Flex h={'100%'} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            boxSize="12"
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            variant="outline"
            color="white"
            onClick={onDrawerOpen}
          />

          <DrawerComponent
            isDrawerOpen={isDrawerOpen}
            onDrawerClose={onDrawerClose}
            onModalRegisterOpen={onModalRegisterOpen}
            onModalSignInOpen={onModalSignInOpen}
          />

          <Box fontSize={20} color={'white'}>
            Book Store
          </Box>
          <Flex>
            <Wrap direction={'row'} spacing={7} align={'center'}>
              <WrapItem>
                <Link
                  _hover={{ textDecoration: 'none' }}
                  textDecorationLine={'none'}
                  fontSize={18}
                  href="/"
                  color={'white'}>
                  Home
                </Link>
              </WrapItem>
              <WrapItem>
                <Link
                  _hover={{ textDecoration: 'none' }}
                  fontSize={18}
                  href="/store"
                  color={'white'}>
                  Store
                </Link>
              </WrapItem>
              {token ? (
                <>
                  <WrapItem>
                    <Link href="/cart" color={'white'}>
                      <Box position={'relative'}>
                        {cartCounter > 0 ? (
                          <Circle
                            zIndex={2}
                            position={'absolute'}
                            bottom={5}
                            left={25}
                            size="1.5rem"
                            backgroundColor={'red'}>
                            {`${cartCounter}`}
                          </Circle>
                        ) : null}

                        <IconButton
                          _hover={{ bg: COLORS.darkPrimaryColor }}
                          _active={{ bg: COLORS.darkPrimaryColor }}
                          backgroundColor={'transparent'}
                          aria-label="cart"
                          icon={<FiShoppingCart color="white" size={25} />}
                        />
                      </Box>
                    </Link>
                  </WrapItem>
                  <WrapItem>
                    {showSpinner ? (
                      <Spinner></Spinner>
                    ) : (
                      <Link href="/profile">
                        <Avatar size="md" src={userProfileData.avatar!} />
                      </Link>
                    )}
                  </WrapItem>
                </>
              ) : null}
            </Wrap>
          </Flex>
        </Flex>
      </Box>
      <Box p={4}>
        <Outlet />
      </Box>

      <SignInModal
        isModalSignInOpen={isModalSignInOpen}
        onModalSignInClose={onModalSignInClose}
        onDrawerClose={onDrawerClose}
      />

      <RegisterModal
        isModalRegisterOpen={isModalRegisterOpen}
        onModalRegisterClose={onModalRegisterClose}
        onDrawerClose={onDrawerClose}
      />
    </>
  );
};

export default Navigation;
