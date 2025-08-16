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
  Tooltip,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  HStack,
  VStack,
  Text,
  Icon,
  Button
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { COLORS } from '../globalColors';
import { HamburgerIcon, CheckIcon, NotAllowedIcon } from '@chakra-ui/icons';
import { FiShoppingCart, FiUserX, FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import SignInModal from './modals/SignInModal';
import RegisterModal from './modals/RegisterModal';
import DrawerComponent from './drawer';
import { useEffect, useState } from 'react';
import { selectCartCounter } from '../reducers/cartSlice';
import { buttonStyles } from '../globalStyles';
import { useApi } from '../hooks/useApi';
import { ApiResponse } from '../model/ApiResponse.model';
import { API_ROUTES } from '../constants/apiConstants';
import { useToastHandler } from '../hooks/useToastHandler';

const Navigation = () => {
  const token = useSelector(selectAuthToken);

  // Drawer state
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const userProfileData = useSelector(selectUserData);
  const cartCounter = useSelector(selectCartCounter);
  const blockStatusApi = useApi<ApiResponse<boolean>>();
  const commentsPermission = useApi<ApiResponse<string>>();
  const [usernameValue, setUsernameValue] = useState<string>('');
  const [blockStatus, setBlockStatus] = useState<boolean | undefined>(undefined);
  const [displayBlockStatus, setDisplayBlockStatus] = useState<boolean>(false);
  const toast = useToastHandler();

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

  const popoverDisclosure = useDisclosure();

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
                    <Popover isOpen={popoverDisclosure.isOpen}>
                      <PopoverTrigger>
                        <WrapItem onClick={popoverDisclosure.onOpen}>
                          <Tooltip label="Block comment" placement="bottom">
                            <IconButton
                              _hover={{ bg: COLORS.darkPrimaryColor }}
                              _active={{ bg: COLORS.darkPrimaryColor }}
                              backgroundColor={'transparent'}
                              aria-label="cart"
                              icon={<FiUserX color="white" size={25} />}
                            />
                          </Tooltip>
                        </WrapItem>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton
                          onClick={() => {
                            popoverDisclosure.onClose();
                            setUsernameValue('');
                            setBlockStatus(undefined);
                            setDisplayBlockStatus(false);
                          }}
                        />
                        <PopoverHeader textAlign={'center'} borderBottom="none">
                          Comments permission
                        </PopoverHeader>
                        <PopoverBody>
                          <VStack>
                            <HStack>
                              <Input
                                placeholder="Enter username"
                                value={usernameValue}
                                onChange={(e) => {
                                  setDisplayBlockStatus(false);
                                  setUsernameValue(e.target.value);
                                  if (e.target.value === '') {
                                    setDisplayBlockStatus(false);
                                  }
                                }}></Input>
                              <IconButton
                                {...buttonStyles}
                                aria-label="search"
                                icon={<FiSearch />}
                                isDisabled={!usernameValue}
                                onClick={async () => {
                                  const status = await blockStatusApi({
                                    method: 'POST',
                                    url: API_ROUTES.commentsStatus,
                                    headers: { Authorization: `Bearer ${token}` },
                                    data: {
                                      username: usernameValue
                                    }
                                  });
                                  if (status && status.status === 401) {
                                    toast('Something went wrong', 'error', 'bottom');
                                    return;
                                  }
                                  setBlockStatus(status && status.data.data);
                                  setDisplayBlockStatus(true);
                                }}></IconButton>
                            </HStack>
                            {displayBlockStatus &&
                              (blockStatus !== undefined ? (
                                <HStack>
                                  <Text>
                                    {blockStatus ? 'Permission blocked' : 'Permission allowed'}
                                  </Text>
                                  <Icon
                                    as={blockStatus ? NotAllowedIcon : CheckIcon}
                                    color={blockStatus ? COLORS.lightRed : COLORS.greenColor}
                                    boxSize={7}></Icon>
                                </HStack>
                              ) : (
                                <HStack>
                                  <Text>User Not Found</Text>
                                  <FiUserX size={20}></FiUserX>
                                </HStack>
                              ))}
                            {displayBlockStatus && blockStatus !== undefined && (
                              <Button
                                {...buttonStyles}
                                _hover={{ bg: blockStatus ? COLORS.greenColor : COLORS.darkRed }}
                                _active={{ bg: blockStatus ? COLORS.greenColor : COLORS.darkRed }}
                                backgroundColor={
                                  blockStatus ? COLORS.lightGreenColor : COLORS.lightRed
                                }
                                onClick={() => {
                                  commentsPermission({
                                    method: 'POST',
                                    url: API_ROUTES.commentsPermission,
                                    headers: { Authorization: `Bearer ${token}` },
                                    data: {
                                      username: usernameValue
                                    }
                                  })
                                    .then((res) => {
                                      if (res && res.status === 401) {
                                        toast('Unauthorized', 'error', 'bottom');
                                        return;
                                      }
                                      toast(res && res.data.message, 'success');
                                      setBlockStatus((prev) => !prev);
                                      popoverDisclosure.onClose();
                                      setUsernameValue('');
                                      setDisplayBlockStatus(false);
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                    });
                                }}>
                                {blockStatus ? 'Unblock' : 'Block'}
                              </Button>
                            )}
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
                  <WrapItem>
                    {showSpinner ? (
                      <Spinner></Spinner>
                    ) : (
                      <Link as={RouterLink} to={`/profile/${userProfileData.username}`}>
                        <Avatar size="md" src={userProfileData.avatar!} />
                      </Link>
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
    </>
  );
};

export default Navigation;
