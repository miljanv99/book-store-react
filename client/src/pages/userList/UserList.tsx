import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Divider,
  HStack,
  List,
  ListItem,
  VStack,
  Text,
  Spinner,
  Flex,
  Input,
  Box,
  Center,
  IconButton,
  Tooltip,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../../globalColors';
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../constants/apiConstants';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { User } from '../../model/User.model';
import { selectAuthToken } from '../../reducers/authSlice';
import { ROUTES } from '../../constants/routes';
import { FiUserX, FiUserPlus } from 'react-icons/fi';
import AddNewUserModal from '../../components/modals/AddNewUserModal';
import { FaUsers, FaUserShield } from 'react-icons/fa6';
import { buttonStyles } from '../../globalStyles';

const UserList = () => {
  const token = useSelector(selectAuthToken);
  const getUsers = useApi<ApiResponse<User[]>>();
  const { userId } = useParams();
  const navigate = useNavigate();
  const addUserModalDisclosure = useDisclosure();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');

  const getAllUsers = async () => {
    const response = await getUsers({
      method: 'GET',
      url: API_ROUTES.getAllUsers,
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response && response.data.data);
  };

  const filteredUsers = useMemo(() => {
    if (inputValue === '' && filter === 'all') {
      return users.sort((a, b) => a.username.localeCompare(b.username));
    }
    if (inputValue === '' && filter !== 'all') {
      if (filter === 'admin') {
        return users.filter((user) => user.isAdmin === true);
      }

      if (filter === 'user') {
        return users.filter((user) => user.isAdmin === false);
      }
    }

    if (inputValue !== '' && filter !== 'all') {
      if (filter === 'admin') {
        return users.filter((user) => user.isAdmin === true && user.username.includes(inputValue));
      }

      if (filter === 'user') {
        return users.filter((user) => user.isAdmin === false && user.username.includes(inputValue));
      }
    }

    return users.filter((user) => user.username.toLowerCase().includes(inputValue.toLowerCase()));
  }, [users, inputValue, filter]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (users.length === 0) return;

    if (!userId) {
      navigate(ROUTES.USERS_LIST.USER_DETAILS_DYNAMIC_PATH(users[0]._id), { replace: true });
      setSelectedUserId(users[0]._id);
      return;
    }

    setSelectedUserId(userId);
  }, [users, userId, navigate]);

  useEffect(() => {
    console.log('SELECTED: ', selectedUserId);
  }, [selectedUserId]);

  if (!selectedUserId) {
    return (
      <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
        <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
      </Flex>
    );
  }

  return (
    <>
      <HStack
        minW={'1200px'}
        maxW={'1750px'}
        p={20}
        margin={'auto'}
        alignItems={'start'}
        justifyContent={'center'}>
        <HStack>
          <VStack w={'25vw'} height={'1800'}>
            <Box width={'100%'} height={'10%'}>
              <HStack>
                <Input
                  height={50}
                  placeholder="Enter username"
                  aria-label="username_input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}></Input>
                <Tooltip label="Add user" placement="top">
                  <IconButton
                    background={'transparent'}
                    aria-label="Add user"
                    icon={
                      <FiUserPlus
                        size={30}
                        onClick={() => {
                          addUserModalDisclosure.onOpen();
                        }}
                      />
                    }
                  />
                </Tooltip>
              </HStack>
              <HStack width={'100%'} justifyContent={'center'} mt={5} mb={5} gap={5}>
                <Tooltip label="Show Only Admins">
                  <IconButton
                    background={'transparent'}
                    aria-label="admins"
                    icon={
                      <FaUserShield
                        color={filter === 'admin' ? COLORS.primaryColor : ''}
                        size={'40px'}></FaUserShield>
                    }
                    onClick={() => {
                      setFilter('admin');
                    }}></IconButton>
                </Tooltip>

                <Tooltip label="Show Only Users">
                  <IconButton
                    background={'transparent'}
                    aria-label="users"
                    icon={
                      <FaUsers
                        color={filter === 'user' ? COLORS.primaryColor : ''}
                        size={'40px'}></FaUsers>
                    }
                    onClick={() => {
                      setFilter('user');
                    }}></IconButton>
                </Tooltip>
                {filter !== 'all' && (
                  <Button
                    {...buttonStyles}
                    onClick={() => {
                      setFilter('all');
                    }}>
                    Clear
                  </Button>
                )}
              </HStack>
              <Text fontSize={'3xl'} textAlign={'center'}>
                Username
              </Text>
            </Box>

            <Box
              w={'inherit'}
              h={'100%'}
              overflow={filteredUsers.length > 16 ? 'scroll' : 'hidden'}
              overflowX={'hidden'}
              display={'flex'}>
              {filteredUsers.length !== 0 ? (
                <List w={'100%'} spacing={6} pr={3}>
                  <>
                    {filteredUsers.map((user) => (
                      <ListItem
                        key={user._id}
                        boxShadow={'2xl'}
                        width={'100%'}
                        border={'1px'}
                        borderColor={COLORS.primaryColor}
                        borderRadius={'base'}
                        pr={3}
                        aria-selected={selectedUserId === user._id ? 'true' : 'false'}
                        transition="all 0.2s ease"
                        _selected={{ backgroundColor: COLORS.primaryColor }}
                        _hover={{ backgroundColor: COLORS.lightPrimaryColor, cursor: 'pointer' }}
                        _active={{ backgroundColor: COLORS.darkPrimaryColor }}>
                        <HStack
                          height={'80px'}
                          p={3}
                          justifyContent={'space-between'}
                          onClick={() => {
                            setSelectedUserId(user._id);
                            navigate(ROUTES.USERS_LIST.USER_DETAILS_DYNAMIC_PATH(user._id));
                          }}>
                          <HStack>
                            <Avatar size={'lg'} src={user.avatar}></Avatar>
                            <Text fontSize={'large'}>{user.username}</Text>
                          </HStack>
                          <ChevronRightIcon></ChevronRightIcon>
                        </HStack>
                      </ListItem>
                    ))}
                  </>
                </List>
              ) : (
                <>
                  <>
                    <VStack flex={1} justifyContent={'center'} alignItems={'center'}>
                      <Center fontSize={'2xl'}>No User Is Found</Center>
                      <FiUserX size={50}></FiUserX>
                    </VStack>
                  </>
                </>
              )}
            </Box>
          </VStack>
        </HStack>
        <Divider
          height={'-webkit-fill-available'}
          borderWidth={2}
          borderRadius={'3xl'}
          orientation="vertical"></Divider>

        {/* User Details child route */}
        <Outlet></Outlet>
      </HStack>

      <AddNewUserModal
        isOpen={addUserModalDisclosure.isOpen}
        onClose={addUserModalDisclosure.onClose}
        setUsers={setUsers}></AddNewUserModal>
    </>
  );
};

export default UserList;
