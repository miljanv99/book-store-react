import {
  Avatar,
  Card,
  Center,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../../reducers/authSlice';
import { User } from '../../model/User.model';
import { useEffect, useState } from 'react';

import FavoriteBookItem from '../../components/book/FavoriteBookItem';
import { useParams } from 'react-router-dom';
import { FiUserX } from 'react-icons/fi';
import ReceiptItem from '../../components/receipt/ReceiptItem';
import ReceiptsModal from '../../components/modals/ReceiptsModal';
import { Receipt } from '../../model/Receipts.model';

const UserDetails = () => {
  const token = useSelector(selectAuthToken);
  const getUserAPI = useApi<ApiResponse<User>>();
  const { userId } = useParams();
  const [user, setUser] = useState<User>();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>();

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

  useEffect(() => {
    getUser();
  }, [userId]);

  return (
    <VStack w={'75vw'} minWidth={'600px'}>
      {user ? (
        <>
          <Text fontSize={'3xl'} textAlign={'center'}>
            User Details
          </Text>
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
