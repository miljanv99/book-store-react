import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Input,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useApi } from '../hooks/useApi';
import { User } from '../model/User.model';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, selectUserData, setUserData } from '../reducers/authSlice';
import { Receipt } from '../model/Receipts.model';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { useToastHandler } from '../hooks/useToastHandler';
import { buttonStyles, cardTextStyle } from '../globalStyles';
import ReceiptItem from '../components/receipt/ReceiptItem';
import FavoriteBookItem from '../components/book/FavoriteBookItem';
import ReceiptsModal from '../components/modals/ReceiptsModal';

const UserProfile = () => {
  const profileData = useApi<ApiResponse<User>>();
  const purchaseHistory = useApi<ApiResponse<Receipt[]>>();
  const editProfile = useApi<ApiResponse<Record<string, string>>>();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [profile, setProfile] = useState<User>();

  const userData = useSelector(selectUserData);
  const token = useSelector(selectAuthToken);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToastHandler();

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [profileInputs, setProfileInputs] = useState({
    username: '',
    email: ''
  });

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleUsernameAndEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setIsEmailValid(emailRegex.test(value));
    }

    setProfileInputs((prevState) => ({
      ...prevState,
      [name]: value
    }));

    console.log('VALID: ', isEmailValid);
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
  }, [userData]);

  return (
    <>
      <VStack mt={'80px'}>
        <Card w={'500px'}>
          <CardHeader display={'flex'} justifyContent={'center'}>
            <VStack width={'100%'}>
              <Avatar boxSize={'200px'} src={profile?.avatar}></Avatar>
              {isEdit ? (
                <Input
                  width={'90%'}
                  name="username"
                  placeholder="Username"
                  onChange={handleUsernameAndEmailInput}
                  defaultValue={profile?.username}
                  isInvalid={!profileInputs.username}></Input>
              ) : (
                <Text {...cardTextStyle} fontWeight={'600'}>
                  {profile?.username}
                </Text>
              )}
            </VStack>
          </CardHeader>
          <CardBody>
            <VStack>
              <Text {...cardTextStyle}>
                User Type: {profile?.isAdmin.toString() === 'false' ? 'User' : 'Admin'}
              </Text>

              {isEdit ? (
                <Input
                  width={'90%'}
                  name="email"
                  placeholder="Email"
                  onChange={handleUsernameAndEmailInput}
                  defaultValue={profile?.email}
                  isInvalid={!isEmailValid}></Input>
              ) : (
                <Text {...cardTextStyle}>{profile?.email}</Text>
              )}
            </VStack>
          </CardBody>
          <CardFooter display={'flex'} justifyContent={'center'}>
            {isEdit ? (
              <>
                <HStack>
                  <Button
                    {...buttonStyles}
                    onClick={() => {
                      setIsEdit(false);
                      setIsEmailValid(true);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    isDisabled={
                      !isEmailValid ||
                      !profileInputs.username ||
                      !profileInputs.email ||
                      (profileInputs.username === profile?.username &&
                        profileInputs.email === profile?.email)
                    }
                    {...buttonStyles}
                    onClick={async () => {
                      const response = await editProfile({
                        method: 'PATCH',
                        url: API_ROUTES.editProfile,
                        headers: { Authorization: `Bearer ${token}` },
                        data: {
                          id: userData.id,
                          username: profileInputs.username,
                          email: profileInputs.email
                        }
                      });
                      if (response?.status === 200) {
                        dispatch(
                          setUserData({
                            ...userData,
                            username:
                              profileInputs.username !== ''
                                ? profileInputs.username
                                : userData.username,
                            email: profileInputs.email !== '' ? profileInputs.email : userData.email
                          })
                        );
                        setIsEdit(false);
                        toast('You successfully changed profile data', 'success');
                      } else {
                        toast('Something went wrong', 'error');
                      }
                    }}>
                    Save
                  </Button>
                </HStack>
              </>
            ) : (
              <Button
                {...buttonStyles}
                onClick={() => {
                  setIsEdit(true);
                  if (profile) {
                    setProfileInputs({
                      username: profile.username,
                      email: profile.email
                    });
                  }
                }}>
                Change Profile Information
              </Button>
            )}
          </CardFooter>
        </Card>

        <HStack w={'100%'} justifyContent={'center'} alignItems={'start'}>
          {/* Favorite Books */}
          <FavoriteBookItem profile={profile}></FavoriteBookItem>

          {/* Receipts */}
          <ReceiptItem
            onOpen={onOpen}
            receipts={receipts}
            setSelectedReceipt={setSelectedReceipt}></ReceiptItem>
        </HStack>
      </VStack>

      {/* Receipt Modal */}
      <ReceiptsModal
        isCentered={true}
        isOpen={isOpen}
        onClose={onClose}
        selectedReceipt={selectedReceipt}></ReceiptsModal>
    </>
  );
};

export default UserProfile;
