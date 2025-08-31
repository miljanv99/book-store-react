// PasswordResetPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Text,
  Icon,
  Center
} from '@chakra-ui/react';
import { useToastHandler } from '../hooks/useToastHandler';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { buttonStyles } from '../globalStyles';

export const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPassword = useApi();
  const navigate = useNavigate();
  const toast = useToastHandler();

  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const handleReset = async () => {
    setIsLoading(true);
    if (!password || !confirmPassword) {
      toast('Please fill all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'error');
      return;
    }

    if (!token || !id) {
      toast('Invalid link', 'error');
      return;
    }
    const response = await resetPassword({
      method: 'POST',
      url: API_ROUTES.restartPassword(token, id),
      data: {
        password: password
      }
    });

    if (response && response.status === 200) {
      setIsSuccessfull(true);
    } else {
      toast('Something went wrong', 'error');
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isSuccessfull ? (
        <Box
          maxW="md"
          mx="auto"
          mt={10}
          p={6}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          marginTop={20}>
          <Heading mb={6}>Reset Password</Heading>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <Button {...buttonStyles} onClick={handleReset} isLoading={loading}>
              Reset Password
            </Button>
          </VStack>
        </Box>
      ) : (
        <Center h="100vh" marginTop={20}>
          <VStack>
            <Icon as={CheckCircleIcon} color={'green'} boxSize={12}></Icon>
            <Text>You Successfully Changed The Password!</Text>
            <Button
              {...buttonStyles}
              onClick={() => {
                navigate('/');
              }}>
              Go Back
            </Button>
          </VStack>
        </Center>
      )}
    </>
  );
};
