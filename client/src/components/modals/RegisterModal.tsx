import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Stack,
  Avatar,
  HStack,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  ModalFooter
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { COLORS } from '../../globalColors';
import { useToastHandler } from '../../hooks/useToastHandler';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { emailRegex, urlRegex } from '../../constants/regex';

interface RegisterProps {
  isModalRegisterOpen: boolean;
  onModalRegisterClose: () => void;
  onDrawerClose: () => void;
}

const RegisterModal: FC<RegisterProps> = ({
  isModalRegisterOpen,
  onModalRegisterClose,
  onDrawerClose
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isValidAvatarURL, setIsValidAvatarURL] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<boolean>(false);
  const [isRegisterBtn, setRegisterBtn] = useState(true);
  const showToast = useToastHandler();
  const userRegister = useApi<ApiResponse<string>>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfrimVisibility = () => {
    setShowConfirm(!showConfirm);
  };

  const [requiredInputs, setRequiredInputs] = useState({
    email: '',
    username: '',
    password: '',
    confirm: ''
  });

  const handleRequiredInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequiredInputs((previousState) => ({
      ...previousState,
      [name]: value
    }));

    if (name === 'avatar') {
      setAvatarUrl(value);
      // Validate URL using the regex
      setIsValidAvatarURL(urlRegex.test(value));
      if (value === '') {
        setAvatarUrl('');
        setPreviewAvatar(false);
      }
    }

    if (name === 'email') {
      setRequiredInputs((previousState) => ({
        ...previousState,
        email: value
      }));
      // Validate email using the regex
      setIsValidEmail(emailRegex.test(value));
      console.log('BBBBBB: ' + isValidEmail);
      if (value === '') {
        setRequiredInputs((prevState) => ({
          ...prevState,
          email: ''
        }));
      }
    }

    console.log(`${name}: ${value}`);
  };

  const handleCloseRegisterModal = () => {
    onModalRegisterClose();
    setRequiredInputs({ username: '', password: '', email: '', confirm: '' });
    handleResetAvatar();
  };

  const handleRegister = async () => {
    const response = await userRegister({
      method: 'POST',
      url: API_ROUTES.register,
      data: {
        email: requiredInputs.email,
        username: requiredInputs.username,
        password: requiredInputs.password,
        confirmPassword: requiredInputs.confirm,
        avatar: avatarUrl
      }
    });
    if (response!.status === 200) {
      console.log(response!.data.message);
      handleCloseRegisterModal();
      onDrawerClose();
    }
    showToast(response?.data.message, response?.status === 200 ? 'success' : 'error');
  };

  const handleAvatarPreview = () => {
    setPreviewAvatar(true);
  };

  const handleResetAvatar = () => {
    setPreviewAvatar(false);
    setAvatarUrl('');
  };

  useEffect(() => {
    if (
      requiredInputs.username === '' ||
      requiredInputs.password === '' ||
      requiredInputs.email === '' ||
      requiredInputs.confirm === '' ||
      requiredInputs.password !== requiredInputs.confirm
    ) {
      setRegisterBtn(true);
    } else {
      setRegisterBtn(false);
    }
  }, [requiredInputs]);
  return (
    <Modal isOpen={isModalRegisterOpen} onClose={handleCloseRegisterModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Register</ModalHeader>
        <ModalBody>
          <Stack alignItems={'center'} spacing={4}>
            {avatarUrl !== '' && previewAvatar ? <Avatar size={'2xl'} src={avatarUrl} /> : null}
            <Input
              name="email"
              type="email"
              placeholder="Enter email"
              variant="flushed"
              onChange={handleRequiredInputs}
              isInvalid={requiredInputs.email !== '' ? !isValidEmail : false}
            />
            <Input
              name="username"
              placeholder="Enter username"
              variant="flushed"
              onChange={handleRequiredInputs}
            />
            <InputGroup>
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                onChange={handleRequiredInputs}
                variant="flushed"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={togglePasswordVisibility}
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <InputGroup>
              <Input
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                onChange={handleRequiredInputs}
                variant="flushed"
              />
              <InputRightElement>
                <IconButton
                  aria-label={showConfirm ? 'Hide confirm' : 'Show confirm'}
                  icon={showConfirm ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleConfrimVisibility}
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            <HStack w={'100%'}>
              <Input
                name="avatar"
                placeholder="Enter avatar URL (optional)"
                value={avatarUrl}
                variant="flushed"
                onChange={(e) => handleRequiredInputs(e)}
                isInvalid={avatarUrl !== '' ? !isValidAvatarURL : false}
                isDisabled={previewAvatar}
              />
              {avatarUrl !== '' ? (
                previewAvatar ? (
                  <Button backgroundColor={'#fb2528'} color={'white'} onClick={handleResetAvatar}>
                    Reset
                  </Button>
                ) : isValidAvatarURL ? (
                  <Button
                    backgroundColor={COLORS.primaryColor}
                    color={'white'}
                    onClick={handleAvatarPreview}>
                    Save
                  </Button>
                ) : null
              ) : null}
            </HStack>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button isDisabled={isRegisterBtn} colorScheme="blue" mr={3} onClick={handleRegister}>
            Register
          </Button>
          <Button variant="ghost" onClick={handleCloseRegisterModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
