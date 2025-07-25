import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  TextProps,
  useDisclosure,
  VStack,
  Wrap
} from '@chakra-ui/react';
import { useApi } from '../hooks/useApi';
import { User } from '../model/User.model';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import { Receipt } from '../model/Receipts.model';
import { COLORS } from '../globalColors';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';

const cardTextStyle: TextProps = {
  textAlign: 'center',
  fontSize: 'x-large'
};

const UserProfile = () => {
  const profileData = useApi<ApiResponse<User>>();
  const purchaseHistory = useApi<ApiResponse<Receipt[]>>();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [profile, setProfile] = useState<User>();

  const userData = useSelector(selectUserData);
  const token = useSelector(selectAuthToken);
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isExpand, setIsExpand] = useState<Record<string, boolean>>({});
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>();

  const showDetails = (receiptId: string) => {
    onOpen();
    const receipt = receipts.find((rec) => rec._id === receiptId);
    setSelectedReceipt(receipt);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const profileResponse = await profileData({
        method: 'GET',
        url: API_ROUTES.getProfile(userData.username),
        headers: { Authorization: `Bearer ${token}` }
      });

      const purchaseResponse = await purchaseHistory({
        method: 'GET',
        url: API_ROUTES.getPurchaseHistory,
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(profileResponse?.data.data!);
      setReceipts(purchaseResponse?.data.data!);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    console.log('AFTER: ', isExpand);
  }, [isExpand]);

  return (
    <>
      <VStack mt={'80px'}>
        <Card w={'500px'}>
          <CardHeader display={'flex'} justifyContent={'center'}>
            <VStack>
              <Avatar boxSize={'200px'} src={profile?.avatar}></Avatar>
              <Text {...cardTextStyle} fontWeight={'600'}>
                {profile?.username}
              </Text>
            </VStack>
          </CardHeader>
          <CardBody>
            <VStack>
              <Text {...cardTextStyle}>
                User Type: {profile?.isAdmin.toString() === 'false' ? 'User' : 'Admin'}
              </Text>
              <Text {...cardTextStyle}>{profile?.email}</Text>
            </VStack>
          </CardBody>
          <CardFooter display={'flex'} justifyContent={'center'}>
            <Button>Change Profile Information</Button>
          </CardFooter>
        </Card>

        <HStack w={'100%'} justifyContent={'center'} alignItems={'start'}>
          {/* Favorite Books */}
          <Card w={'900px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <CardHeader display={'flex'} justifyContent={'center'}>
              <Text {...cardTextStyle} fontWeight={'600'}>
                Favorite Books
              </Text>
            </CardHeader>
            <CardBody>
              <Wrap display={'flex'} justify={'center'}>
                {profile?.favoriteBooks.map((book) => (
                  <Image
                    key={book._id}
                    w={200}
                    h={300}
                    src={book.cover}
                    cursor={'pointer'}
                    onClick={async () => {
                      navigate(`/bookDetails/${book._id}`);
                      scrollTo({ top: 0, behavior: 'instant' });
                    }}></Image>
                ))}
              </Wrap>
            </CardBody>
          </Card>

          {/* Receipts */}
          <Card w={'900px'} display={'flex'}>
            <CardHeader display={'flex'} justifyContent={'center'}>
              <Text {...cardTextStyle} fontWeight={'600'}>
                Purchase History
              </Text>
            </CardHeader>
            <CardBody>
              <Wrap display={'flex'} justify={'space-evenly'}>
                {receipts?.map((receipt, index) => (
                  <>
                    <VStack>
                      <Text
                        key={receipt._id}
                        _active={{ color: 'grey' }}
                        fontWeight={600}
                        cursor={'pointer'}
                        onClick={() => {
                          console.log('BEFORE: ', isExpand);
                          setIsExpand((prevState) => ({
                            ...prevState,
                            [receipt._id]: !prevState[receipt._id]
                          }));
                        }}>
                        {index + 1}. {receipt._id}
                      </Text>

                      <VStack>
                        {isExpand[receipt._id] ? (
                          <>
                            <HStack>
                              <Text>
                                {receipt.productsInfo.length > 1 ? 'Items' : 'Item'}:{' '}
                                {receipt.productsInfo.length}
                              </Text>
                              <Text>Total price: {receipt.totalPrice.toFixed(2)}$</Text>
                            </HStack>
                            <Button
                              onClick={() => showDetails(receipt._id)}
                              backgroundColor={COLORS.darkPrimaryColor}>
                              View Details
                            </Button>
                          </>
                        ) : null}
                      </VStack>
                    </VStack>
                  </>
                ))}
              </Wrap>
            </CardBody>
          </Card>
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay>
          <ModalContent maxW={'800px'}>
            <ModalHeader textAlign={'center'}>Receipt ID: {selectedReceipt?._id}</ModalHeader>
            <ModalBody>
              {selectedReceipt?.productsInfo.map((product) => (
                <VStack>
                  <HStack w={'100%'}>
                    <Image height={'100px'} mt={'8px'} src={product.cover}></Image>
                    <Flex flex={1}>
                      <Text w={'50%'}>{product.title}</Text>
                      <HStack flex={1} justify="space-between">
                        <Text>Qty: {product.qty}</Text>
                        <Text>{product.price}$</Text>
                        <Text>{(product.price * product.qty).toFixed(2)}$</Text>
                      </HStack>
                    </Flex>
                  </HStack>
                </VStack>
              ))}
              <Text textAlign={'end'} fontSize={'x-large'} fontWeight={600}>
                {selectedReceipt?.totalPrice.toFixed(2)}$
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default UserProfile;
