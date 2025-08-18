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
import { selectUserData, setUserData } from '../reducers/authSlice';
import { Receipt } from '../model/Receipts.model';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { useToastHandler } from '../hooks/useToastHandler';
import { buttonStyles, cardTextStyle } from '../globalStyles';
import ReceiptItem from '../components/receipt/ReceiptItem';
import FavoriteBookItem from '../components/book/FavoriteBookItem';
import ReceiptsModal from '../components/modals/ReceiptsModal';
import { emailRegex, urlRegex } from '../constants/regex';

const UserProfile = () => {
  const profileData = useApi<ApiResponse<User>>();
  const purchaseHistory = useApi<ApiResponse<Receipt[]>>();
  const editProfile = useApi<ApiResponse<Record<string, string>>>();

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [profile, setProfile] = useState<User>();

  const userData = useSelector(selectUserData);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToastHandler();

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAvatarPreview, setAvatarPreview] = useState<boolean>(false);

  const [profileInputs, setProfileInputs] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isValidAvatarURL, setIsValidAvatarURL] = useState<boolean>(true);

  const handleUsernameAndEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setIsEmailValid(emailRegex.test(value));
    }

    if (name === 'avatar') {
      setProfileInputs((prev) => ({
        ...prev,
        avatar: value
      }));
      // Validate URL using the regex
      setIsValidAvatarURL(urlRegex.test(value));
      if (value === '') {
        setProfileInputs((prev) => ({
          ...prev,
          avatar: ''
        }));
        setAvatarPreview(false);
      }
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
        url: API_ROUTES.getProfile(userData.username)
      });

      const purchaseResponse = await purchaseHistory({
        method: 'GET',
        url: API_ROUTES.getPurchaseHistory
      });
      if (profileResponse && purchaseResponse) {
        setProfile(profileResponse.data.data);
        setReceipts(purchaseResponse.data.data);
      }
    };
    fetchProfile();
  }, [userData]);

  return (
    <>
      {profile && (
        <VStack mt={'80px'}>
          <Card w={'500px'}>
            <CardHeader display={'flex'} justifyContent={'center'}>
              <VStack width={'100%'}>
                <Avatar boxSize={'200px'} src={profile.avatar}></Avatar>
                {isEdit ? (
                  <>
                    <HStack width={'90%'}>
                      <Input
                        name="avatar"
                        placeholder="Avatar Url"
                        onChange={handleUsernameAndEmailInput}
                        value={profileInputs?.avatar}
                        isInvalid={!profileInputs.avatar || !isValidAvatarURL}
                        isDisabled={isAvatarPreview}></Input>
                      {profileInputs.avatar !== profile.avatar &&
                      isValidAvatarURL &&
                      profileInputs.avatar !== '' ? (
                        <Button
                          {...buttonStyles}
                          onClick={() => {
                            setProfile((prev) => ({
                              ...prev!,
                              avatar: profileInputs.avatar
                            }));
                            setAvatarPreview(true);
                          }}>
                          Preview
                        </Button>
                      ) : isAvatarPreview ? (
                        <Button
                          {...buttonStyles}
                          _hover={{ backgroundColor: '#fb2528' }}
                          _active={{ backgroundColor: '#b10205ff' }}
                          backgroundColor={'#fb2528'}
                          color={'white'}
                          onClick={() => {
                            setProfile((prev) => ({
                              ...prev!,
                              avatar: userData.avatar
                            }));
                            setProfileInputs((prev) => ({
                              ...prev,
                              avatar: userData.avatar
                            }));
                            setAvatarPreview(false);
                          }}>
                          Reset
                        </Button>
                      ) : null}
                    </HStack>
                    <Input
                      width={'90%'}
                      name="username"
                      placeholder="Username"
                      onChange={handleUsernameAndEmailInput}
                      defaultValue={profile.username}
                      isInvalid={!profileInputs.username}></Input>
                  </>
                ) : (
                  <Text {...cardTextStyle} fontWeight={'600'}>
                    {profile.username}
                  </Text>
                )}
              </VStack>
            </CardHeader>
            <CardBody>
              <VStack>
                <Text {...cardTextStyle}>
                  User Type: {profile.isAdmin.toString() === 'false' ? 'User' : 'Admin'}
                </Text>

                {isEdit ? (
                  <Input
                    width={'90%'}
                    name="email"
                    placeholder="Email"
                    onChange={handleUsernameAndEmailInput}
                    defaultValue={profile.email}
                    isInvalid={!isEmailValid}></Input>
                ) : (
                  <Text {...cardTextStyle}>{profile.email}</Text>
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
                        !isValidAvatarURL ||
                        !isEmailValid ||
                        !profileInputs.username ||
                        !profileInputs.email ||
                        (profileInputs.username === profile.username &&
                          profileInputs.email === profile.email &&
                          profileInputs.avatar === userData?.avatar)
                      }
                      {...buttonStyles}
                      onClick={async () => {
                        const response = await editProfile({
                          method: 'PATCH',
                          url: API_ROUTES.editProfile,
                          data: {
                            id: userData._id,
                            username: profileInputs.username,
                            email: profileInputs.email,
                            avatar: profileInputs.avatar
                          }
                        });
                        if (response?.status === 200) {
                          dispatch(
                            setUserData({
                              ...userData,
                              username: profileInputs.username,
                              email: profileInputs.email,
                              avatar: profileInputs.avatar
                            })
                          );
                          setIsEdit(false);
                          setAvatarPreview(false);
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
                        email: profile.email,
                        avatar: profile.avatar
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
      )}

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
