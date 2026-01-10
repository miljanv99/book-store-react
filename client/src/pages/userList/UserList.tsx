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
  Flex
} from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { COLORS } from '../../globalColors';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { API_ROUTES } from '../../constants/apiConstants';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { User } from '../../model/User.model';
import { selectAuthToken } from '../../reducers/authSlice';
import { ROUTES } from '../../constants/routes';

const UserList = () => {
  const token = useSelector(selectAuthToken);
  const getUsers = useApi<ApiResponse<User[]>>();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getAllUsers = async () => {
    const response = await getUsers({
      method: 'GET',
      url: API_ROUTES.getAllUsers,
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response && response.data.data);
  };

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
          <VStack w={'25vw'} height={'800'}>
            <Text fontSize={'3xl'} textAlign={'center'}>
              Username
            </Text>

            <List w={'inherit'} spacing={6} overflow={'scroll'} overflowX={'hidden'} pr={3}>
              {users.map((user) => (
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
            </List>
          </VStack>
        </HStack>
        <Divider borderWidth={2} borderRadius={'3xl'} orientation="vertical"></Divider>

        {/* User Details child route */}
        <Outlet></Outlet>
      </HStack>
    </>
  );
};

export default UserList;
