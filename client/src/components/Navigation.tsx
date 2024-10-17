import { Box, useDisclosure, Flex, Link, Wrap, WrapItem, IconButton } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { COLORS } from '../globalColors';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import SignInModal from './SignInModal';
import RegisterModal from './RegisterModal';
import DrawerComponent from './drawer';

const Navigation = () => {
  const token = useSelector(selectAuthToken);

  // Drawer state
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

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

  return (
    <>
      <Box w={'100%'} h={20} bg={COLORS.primaryColor} px={4}>
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
                <WrapItem>
                  <Link href="/cart" color={'white'}>
                    <IconButton aria-label="cart" icon={<FiShoppingCart size={18} />} />
                  </Link>
                </WrapItem>
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
