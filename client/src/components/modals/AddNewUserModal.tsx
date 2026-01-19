import {
  Avatar,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  RadioGroup,
  Radio,
  Spinner
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { buttonStyles } from '../../globalStyles';
import { emailRegex, urlRegex } from '../../constants/regex';
import { useApi } from '../../hooks/useApi';
import { ROUTES } from '../../constants/routes';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../../reducers/authSlice';
import { useToastHandler } from '../../hooks/useToastHandler';
import { User } from '../../model/User.model';

type AddNewUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const AddNewUserModal: FC<AddNewUserModalProps> = ({ isOpen, onClose, setUsers }) => {
  const [profileInputs, setProfileInputs] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isAvatarUrlValid, setIsAvatarUrlValid] = useState<boolean>(true);
  const [avatarPreview, setAvatarPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valueRadio, setValueRadio] = useState<string>('admin');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const token = useSelector(selectAuthToken);
  const toast = useToastHandler();

  const addUserAPI = useApi<string>();

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'avatar') {
      setIsAvatarUrlValid(urlRegex.test(value));
      if (value === '') {
        setAvatarUrl('');
        setAvatarPreview(false);
      }
    }

    if (name === 'email') {
      setIsEmailValid(emailRegex.test(value));
    }

    setProfileInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    console.log('TEST: ', valueRadio);
  }, [valueRadio]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnOverlayClick={!isLoading}>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader textAlign={'center'}>Add User</ModalHeader>
          <ModalBody>
            <VStack justifyContent={'center'}>
              <Avatar boxSize={'150px'} src={avatarUrl}></Avatar>
              <Input name="username" placeholder="Username" onChange={handleInputs}></Input>
              <Input name="email" placeholder="Email" onChange={handleInputs}></Input>
              <HStack width={'100%'}>
                <Input
                  name="avatar"
                  value={profileInputs.avatar}
                  placeholder="Avatar (optional)"
                  onChange={handleInputs}></Input>

                {profileInputs.avatar !== '' && isAvatarUrlValid && !avatarPreview ? (
                  <Button
                    {...buttonStyles}
                    onClick={() => {
                      setAvatarUrl(profileInputs.avatar);
                      setAvatarPreview(true);
                    }}>
                    Preview
                  </Button>
                ) : avatarPreview ? (
                  <>
                    <Button
                      _hover={{ backgroundColor: '#fb2528' }}
                      _active={{ backgroundColor: '#b10205ff' }}
                      backgroundColor={'#fb2528'}
                      onClick={() => {
                        setAvatarUrl('');
                        setAvatarPreview(false);
                        setProfileInputs((prev) => ({
                          ...prev,
                          avatar: ''
                        }));
                      }}>
                      Reset
                    </Button>
                  </>
                ) : null}
              </HStack>
              <RadioGroup width={'100%'} onChange={setValueRadio} value={valueRadio}>
                <HStack width={'inherit'} justifyContent={'center'}>
                  <Radio size={'lg'} value="admin">
                    Admin
                  </Radio>
                  <Radio size={'lg'} ml={3} value="user">
                    User
                  </Radio>
                </HStack>
              </RadioGroup>
              <ModalFooter width={'100%'}>
                <HStack alignItems={'end'}>
                  <Button
                    isDisabled={isLoading}
                    {...buttonStyles}
                    onClick={() => {
                      onClose();
                      setProfileInputs({ email: '', username: '', avatar: '' });
                      setValueRadio('admin');
                      setAvatarPreview(false);
                      setAvatarUrl('');
                    }}>
                    Close
                  </Button>
                  <Button
                    isDisabled={
                      isLoading ||
                      profileInputs.username === '' ||
                      !isEmailValid ||
                      (!isAvatarUrlValid && profileInputs.avatar !== '')
                    }
                    {...buttonStyles}
                    onClick={async () => {
                      setIsLoading(true);
                      const response = await addUserAPI({
                        method: 'POST',
                        url: ROUTES.ADD_NEW_USER,
                        headers: { Authorization: `Bearer ${token}` },
                        data: {
                          username: profileInputs.username,
                          email: profileInputs.email,
                          ...(profileInputs.avatar && { avatar: profileInputs.avatar }),
                          role: valueRadio
                        }
                      });

                      if (response && response.status === 200) {
                        setIsLoading(false);
                        setAvatarPreview(false);
                        setAvatarUrl('');
                        setValueRadio('admin');
                        setProfileInputs({ username: '', email: '', avatar: '' });
                        const createdUser = response.data.data;
                        onClose();
                        setUsers((prev) => [...prev, createdUser]);
                        toast(response.data.message, 'success');
                      } else {
                        setIsLoading(false);
                        toast(response && response.data.message, 'error');
                      }
                    }}>
                    {isLoading ? <Spinner></Spinner> : 'Save'}
                  </Button>
                </HStack>
              </ModalFooter>
            </VStack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default AddNewUserModal;
