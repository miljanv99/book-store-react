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
  Circle,
  Tooltip
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { COLORS } from '../globalColors';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart, FiUsers, FiHome } from 'react-icons/fi';
import { MdStorefront } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import SignInModal from './modals/SignInModal';
import RegisterModal from './modals/RegisterModal';
import DrawerComponent from './drawer';
import { useEffect, useState } from 'react';
import { selectCartCounter } from '../reducers/cartSlice';
import AdminModal from './modals/AdminModal';
import { ROUTES } from '../constants/routes';

const Navigation = () => {
  const token = useSelector(selectAuthToken);

  // Drawer state
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const userProfileData = useSelector(selectUserData);
  const cartCounter = useSelector(selectCartCounter);
  const localStorageSearch = localStorage.getItem('search');

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

  const adminModalDisclosure = useDisclosure();

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
                <Tooltip label="Home">
                  <Link
                    _hover={{ textDecoration: 'none' }}
                    textDecorationLine={'none'}
                    fontSize={18}
                    href="/"
                    color={'white'}>
                    <IconButton
                      _hover={{ bg: COLORS.darkPrimaryColor }}
                      _active={{ bg: COLORS.darkPrimaryColor }}
                      backgroundColor={'transparent'}
                      aria-label="store"
                      icon={<FiHome color="white" size={25} />}></IconButton>
                  </Link>
                </Tooltip>
              </WrapItem>
              <WrapItem>
                <Tooltip label="Store">
                  <Link
                    as={RouterLink}
                    to={{ pathname: ROUTES.STORE, search: localStorageSearch ?? '' }}
                    _hover={{ textDecoration: 'none' }}
                    fontSize={18}
                    color={'white'}>
                    <IconButton
                      _hover={{ bg: COLORS.darkPrimaryColor }}
                      _active={{ bg: COLORS.darkPrimaryColor }}
                      backgroundColor={'transparent'}
                      aria-label="store"
                      icon={<MdStorefront color="white" size={25} />}></IconButton>
                  </Link>
                </Tooltip>
              </WrapItem>
              {token && (
                <>
                  <WrapItem>
                    <Tooltip label="Cart" placement="bottom">
                      <Link href="/cart" color={'white'}>
                        <Box position={'relative'}>
                          {cartCounter > 0 && (
                            <Circle
                              zIndex={2}
                              position={'absolute'}
                              bottom={5}
                              left={25}
                              size="1.5rem"
                              backgroundColor={'red'}>
                              {`${cartCounter}`}
                            </Circle>
                          )}

                          <IconButton
                            _hover={{ bg: COLORS.darkPrimaryColor }}
                            _active={{ bg: COLORS.darkPrimaryColor }}
                            backgroundColor={'transparent'}
                            aria-label="cart"
                            icon={<FiShoppingCart color="white" size={25} />}
                          />
                        </Box>
                      </Link>
                    </Tooltip>
                  </WrapItem>
                  {token && userProfileData.isAdmin && (
                    <WrapItem onClick={adminModalDisclosure.onOpen}>
                      <Tooltip label="Admin" placement="bottom">
                        <IconButton
                          _hover={{ bg: COLORS.darkPrimaryColor }}
                          _active={{ bg: COLORS.darkPrimaryColor }}
                          backgroundColor={'transparent'}
                          aria-label="cart"
                          icon={<FiUsers color="white" size={25} />}
                        />
                      </Tooltip>
                    </WrapItem>
                  )}
                  <WrapItem>
                    {showSpinner ? (
                      <Spinner></Spinner>
                    ) : (
                      <Tooltip label="Profile">
                        <Link as={RouterLink} to={`/profile/${userProfileData.username}`}>
                          <Avatar size="md" src={userProfileData.avatar!} />
                        </Link>
                      </Tooltip>
                    )}
                  </WrapItem>
                </>
              )}
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

      {token && userProfileData.isAdmin && (
        <AdminModal
          isModalOpen={adminModalDisclosure.isOpen}
          onClose={adminModalDisclosure.onClose}></AdminModal>
      )}
    </>
  );
};

export default Navigation;
