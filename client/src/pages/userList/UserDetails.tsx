import {
  Avatar,
  Card,
  Center,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, selectUserData, setUserData } from '../../reducers/authSlice';
import { User } from '../../model/User.model';
import { useEffect, useState } from 'react';

import FavoriteBookItem from '../../components/book/FavoriteBookItem';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUserX } from 'react-icons/fi';
import ReceiptItem from '../../components/receipt/ReceiptItem';
import ReceiptsModal from '../../components/modals/ReceiptsModal';
import { Receipt } from '../../model/Receipts.model';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { useToastHandler } from '../../hooks/useToastHandler';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { ROUTES } from '../../constants/routes';

const UserDetails = () => {
  const token = useSelector(selectAuthToken);
  const getUserAPI = useApi<ApiResponse<User>>();
  const commentsPermission = useApi<ApiResponse<string>>();
  const toggleAdminPermission = useApi<ApiResponse<string>>();
  const toast = useToastHandler();
  const { userId } = useParams();
  const [user, setUser] = useState<User>();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpenAdminPermission,
    isOpen: isOpenAdminPermission,
    onClose: onCloseAdminPermission
  } = useDisclosure();

  const {
    onOpen: onOpenLocalUser,
    isOpen: isOpenLocalUser,
    onClose: onCloseLocalUser
  } = useDisclosure();

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>();
  const localUserData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUser = async () => {
    let response =
      userId &&
      (await getUserAPI({
        method: 'GET',
        url: API_ROUTES.getUser(userId),
        headers: { Authorization: `Bearer ${token}` }
      }));

    setUser(response && response.data.data);
  };

  const handleAdminPermission = async (userData: Record<string, boolean>): Promise<boolean> => {
    const response = await toggleAdminPermission({
      method: 'POST',
      url: API_ROUTES.adminPermission,
      headers: { Authorization: `Bearer ${token}` },
      data: userData
    });

    if (response && response.status === 200) {
      setUser((prev) => (prev ? { ...prev, isAdmin: !prev.isAdmin } : prev));
      toast('Successfully updated Admin Permission', 'success', 'bottom');
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  return (
    <VStack w={'75vw'} minWidth={'600px'}>
      {user ? (
        <>
          <HStack width={'100%'} justifyContent={'center'} position={'relative'}>
            <Text fontSize={'3xl'} textAlign={'center'}>
              User Details
            </Text>
            <Menu>
              <MenuButton
                as={IconButton}
                backgroundColor={'transparent'}
                aria-label="More"
                position={'absolute'}
                right={5}
                icon={<FaEllipsisVertical size={24}></FaEllipsisVertical>}></MenuButton>
              <MenuList>
                <MenuItem
                  justifyContent={'center'}
                  onClick={() => {
                    // admin permission can not be added if the user already has blocked comments
                    if (user.isCommentsBlocked) {
                      onOpenAdminPermission();
                      return;
                    }

                    if (user._id == localUserData._id) {
                      onOpenLocalUser();
                      return;
                    }

                    handleAdminPermission({ [user.username]: !user.isAdmin });
                  }}>
                  <Text>{user.isAdmin ? 'Remove Admin Permission' : 'Add Admin Permission'}</Text>
                </MenuItem>
                {!user.isAdmin && (
                  <MenuItem
                    justifyContent={'center'}
                    onClick={() => {
                      commentsPermission({
                        method: 'POST',
                        url: API_ROUTES.commentsPermission,
                        headers: { Authorization: `Bearer ${token}` },
                        data: {
                          username: user.username
                        }
                      })
                        .then((res) => {
                          if (res && res.status === 401) {
                            toast('Unauthorized', 'error', 'bottom');
                            return;
                          }
                          setUser((prev) =>
                            prev ? { ...prev, isCommentsBlocked: !prev.isCommentsBlocked } : prev
                          );
                          toast(res && res.data.message, 'success');
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}>
                    {user.isCommentsBlocked
                      ? 'Unblock Comment Permission'
                      : 'Block Comment Permission'}
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </HStack>
          <HStack maxWidth={'1150px'} width={'100%'} justifyContent={'center'}>
            <VStack w={'inherit'}>
              <Avatar boxSize={'200px'} src={user.avatar}></Avatar>
              <Text fontSize={'2xl'}>{user?.username}</Text>
              <HStack w={'80%'} justifyContent={'space-around'}>
                <Card w={'50vw'} h={90} minW={'190px'}>
                  <VStack h={'inherit'} justifyContent={'center'}>
                    <Text>
                      User Type:{' '}
                      <>
                        <strong>{user.isAdmin ? 'Admin' : 'User'}</strong>
                      </>
                    </Text>
                    <Text>
                      Email:{' '}
                      <>
                        <strong>{user.email}</strong>
                      </>
                    </Text>
                  </VStack>
                </Card>
                <Card w={'50vw'} h={90} minW={'190px'}>
                  <VStack h={'inherit'} justifyContent={'center'}>
                    <Text>
                      Comment Status:{' '}
                      <>
                        <strong>{user.isCommentsBlocked ? 'Blocked' : 'Allowed'}</strong>
                      </>
                    </Text>
                    <Text>
                      Number Of Comments:{' '}
                      <>
                        <strong>{user.commentsCount}</strong>
                      </>
                    </Text>
                  </VStack>
                </Card>
              </HStack>

              <FavoriteBookItem
                profile={user}
                cardWidth={'90%'}
                bookImageWidth={150}
                bookImageHeight={250}></FavoriteBookItem>

              <ReceiptItem
                receipts={user.receipts}
                onOpen={onOpen}
                setSelectedReceipt={setSelectedReceipt}
                cardWidth={'90%'}></ReceiptItem>

              <ReceiptsModal
                isCentered={true}
                isOpen={isOpen}
                onClose={onClose}
                selectedReceipt={selectedReceipt}></ReceiptsModal>
            </VStack>
          </HStack>

          {/* Modal for adding permission to user with blocked comments */}
          <ConfirmationModal
            headerText={'Permission Update Failed'}
            bodyContent={
              "You can't assign admin permissions while comments are blocked for this user. Unblock comments first, then try again."
            }
            isModalOpen={isOpenAdminPermission}
            onClose={onCloseAdminPermission}
            onCloseBtnText={user._id === localUserData._id ? 'No' : 'Ok'}></ConfirmationModal>

          {/* Remove admin permission from local account */}
          <ConfirmationModal
            headerText={'Permission Change Confirmation'}
            bodyContent={
              'Please confirm that you want to remove admin permissions from your account.'
            }
            isModalOpen={isOpenLocalUser}
            onClose={onCloseLocalUser}
            onCloseBtnText={'Close'}
            onConfirm={() => {
              handleAdminPermission({ [user.username]: !user.isAdmin }).then((isSuccess) => {
                isSuccess
                  ? (dispatch(setUserData({ ...localUserData, isAdmin: !localUserData.isAdmin })),
                    navigate(ROUTES.HOME))
                  : toast('Someting went wrong', 'error');
              });
            }}
            onConfirmBtnText="Confirm"></ConfirmationModal>
        </>
      ) : (
        <>
          <Center width={'100%'} height={'1000px'}>
            <VStack>
              <Heading>There Is No User With Provided ID</Heading>
              <FiUserX size={50}></FiUserX>
            </VStack>
          </Center>
        </>
      )}
    </VStack>
  );
};

export default UserDetails;
