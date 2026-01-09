import { NotAllowedIcon, CheckIcon } from '@chakra-ui/icons';
import {
  Center,
  Tabs,
  TabList,
  Tab,
  HStack,
  TabPanels,
  TabPanel,
  Button,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Icon,
  IconButton,
  Input,
  Wrap,
  Checkbox,
  useDisclosure,
  Box,
  ModalCloseButton
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { FiShield, FiSearch, FiUserX, FiMessageCircle } from 'react-icons/fi';
import { API_ROUTES } from '../../constants/apiConstants';
import { COLORS } from '../../globalColors';
import { buttonStyles } from '../../globalStyles';
import { useApi } from '../../hooks/useApi';
import { useToastHandler } from '../../hooks/useToastHandler';
import { ApiResponse } from '../../model/ApiResponse.model';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, selectAuthToken, selectUserData, setUserData } from '../../reducers/authSlice';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';

interface adminModalProps {
  onClose: () => void;
  isModalOpen: boolean;
}

type User = {
  username: string;
  isAdmin: boolean;
};

const AdminModal: FC<adminModalProps> = ({ isModalOpen, onClose }) => {
  const blockStatusApi = useApi<ApiResponse<boolean>>();
  const commentsPermission = useApi<ApiResponse<string>>();
  const toggleAdminPermission = useApi<ApiResponse<string>>();
  const getUsers = useApi<ApiResponse<string[]>>();

  const [usernameValue, setUsernameValue] = useState<string>('');
  const [blockStatus, setBlockStatus] = useState<boolean | undefined>(undefined);
  const [displayBlockStatus, setDisplayBlockStatus] = useState<boolean>(false);
  const [isAdminPermissionTabInFocus, setAdminPermissionTabInFocus] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [adminPermissionInDraft, setAdminPermissionInDraft] = useState<Record<string, boolean>>({});

  const toast = useToastHandler();
  const token = useSelector(selectAuthToken);
  const localUserName = useSelector(selectUserData).username;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const confirmationModalDisclosure = useDisclosure();

  const getAllUsers = async () => {
    const response = await getUsers({
      method: 'GET',
      url: API_ROUTES.getAllUsers,
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response && response.data.data);
    setOriginalUsers(response && response.data.data);
  };

  const handleAdminPermission = (user: Record<string, boolean>) => {
    toggleAdminPermission({
      method: 'POST',
      url: API_ROUTES.adminPermission,
      headers: { Authorization: `Bearer ${token}` },
      data: user
    })
      .then(() => {
        toast('Successfully updated Admin Permission', 'success', 'bottom');

        for (const username in user) {
          //update the UI
          setUsers((prev) => {
            const updated = prev.map((prevUser) =>
              prevUser.username === username ? { ...prevUser, isAdmin: prevUser.isAdmin } : prevUser
            );

            //update the origin user list
            setOriginalUsers(updated);

            return updated;
          });
        }

        setAdminPermissionInDraft({});
      })
      .catch((error) => {
        console.error(error);
        toast('Something went wrong!', 'error', 'bottom');
      });
  };

  useEffect(() => {
    console.log('GET ALL USERS');
    getAllUsers();
  }, [localUserName]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay>
          <ModalContent maxW={'800px'}>
            <ModalHeader textAlign={'center'}>
              <ModalCloseButton
                onClick={() => {
                  onClose();
                  setAdminPermissionTabInFocus(false);
                }}></ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <Tabs flex={1}>
                <TabList justifyContent={'center'}>
                  <Tab onFocus={() => setAdminPermissionTabInFocus(false)}>
                    <HStack spacing={2}>
                      <FiMessageCircle />
                      <span>Comment Permission</span>
                    </HStack>
                  </Tab>
                  <Tab onFocus={() => setAdminPermissionTabInFocus(true)}>
                    <HStack spacing={2}>
                      <FiShield />
                      <span>Admin Permission</span>
                    </HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <Center>
                    <TabPanel>
                      <VStack>
                        <HStack>
                          <Input
                            placeholder="Enter username"
                            value={usernameValue}
                            onChange={(e) => {
                              setDisplayBlockStatus(false);
                              setUsernameValue(e.target.value);
                              if (e.target.value === '') {
                                setDisplayBlockStatus(false);
                              }
                            }}></Input>
                          <IconButton
                            {...buttonStyles}
                            aria-label="search"
                            icon={<FiSearch />}
                            isDisabled={!usernameValue}
                            onClick={async () => {
                              const status = await blockStatusApi({
                                method: 'POST',
                                url: API_ROUTES.commentsStatus,
                                headers: { Authorization: `Bearer ${token}` },
                                data: {
                                  username: usernameValue
                                }
                              });
                              if (status && status.status === 401) {
                                toast('Something went wrong', 'error', 'bottom');
                                return;
                              }
                              setBlockStatus(status && status.data.data);
                              setDisplayBlockStatus(true);
                            }}></IconButton>
                        </HStack>
                        {displayBlockStatus &&
                          (blockStatus !== undefined ? (
                            <HStack>
                              <Text>
                                {blockStatus ? 'Permission blocked' : 'Permission allowed'}
                              </Text>
                              <Icon
                                as={blockStatus ? NotAllowedIcon : CheckIcon}
                                color={blockStatus ? COLORS.lightRed : COLORS.greenColor}
                                boxSize={7}></Icon>
                            </HStack>
                          ) : (
                            <HStack>
                              <Text>User Not Found</Text>
                              <FiUserX size={20}></FiUserX>
                            </HStack>
                          ))}
                        {displayBlockStatus && blockStatus !== undefined && (
                          <Button
                            {...buttonStyles}
                            _hover={{ bg: blockStatus ? COLORS.greenColor : COLORS.darkRed }}
                            _active={{ bg: blockStatus ? COLORS.greenColor : COLORS.darkRed }}
                            backgroundColor={blockStatus ? COLORS.lightGreenColor : COLORS.lightRed}
                            onClick={() => {
                              commentsPermission({
                                method: 'POST',
                                url: API_ROUTES.commentsPermission,
                                headers: { Authorization: `Bearer ${token}` },
                                data: {
                                  username: usernameValue
                                }
                              })
                                .then((res) => {
                                  if (res && res.status === 401) {
                                    toast('Unauthorized', 'error', 'bottom');
                                    return;
                                  }
                                  toast(res && res.data.message, 'success');
                                  setBlockStatus((prev) => !prev);
                                  setUsernameValue('');
                                  setDisplayBlockStatus(false);
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }}>
                            {blockStatus ? 'Unblock' : 'Block'}
                          </Button>
                        )}
                      </VStack>
                    </TabPanel>
                  </Center>
                  <Center>
                    <TabPanel>
                      <VStack maxH="600px" overflowY="auto">
                        <Wrap>
                          {users.map((user) => (
                            <HStack margin={2} key={user.username}>
                              <Text fontSize={'larger'}>{user.username}</Text>
                              <Checkbox
                                size={'lg'}
                                iconSize={8}
                                isChecked={user.isAdmin}
                                onChange={() => {
                                  //update the UI
                                  setUsers((prev) =>
                                    prev.map((usr) =>
                                      usr.username === user.username
                                        ? { ...usr, isAdmin: !usr.isAdmin }
                                        : usr
                                    )
                                  );
                                  //update draft state
                                  setAdminPermissionInDraft((prev) => {
                                    const index = users.findIndex(
                                      (u) => u.username === user.username
                                    );

                                    const originalValue = originalUsers[index].isAdmin;
                                    const newValue = !users[index].isAdmin;

                                    const updated = { ...prev };

                                    console.log('UPDATED BEFORE: ', updated);

                                    if (newValue === originalValue) {
                                      delete updated[user.username];
                                    } else {
                                      updated[user.username] = newValue;
                                    }

                                    console.log('UPDATED AFTER: ', updated);
                                    return updated;
                                  });
                                }}></Checkbox>
                            </HStack>
                          ))}
                          {Object.keys(adminPermissionInDraft).length !== 0 && (
                            <Box flex={1} display={'flex'} justifyContent={'center'}></Box>
                          )}
                        </Wrap>
                      </VStack>
                    </TabPanel>
                  </Center>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <HStack w={'100%'} justifyContent={'space-between'}>
                <Button
                  {...buttonStyles}
                  onClick={() => {
                    onClose();
                    navigate('users');
                  }}>
                  View User List
                </Button>
                <HStack>
                  {Object.keys(adminPermissionInDraft).length !== 0 &&
                    isAdminPermissionTabInFocus && (
                      <Button
                        alignSelf={'center'}
                        {...buttonStyles}
                        onClick={() => {
                          const index = users.findIndex((u) => u.username === localUserName);
                          const newValue = users[index].isAdmin;
                          const originalValue = originalUsers[index].isAdmin;
                          const isLocalUser = newValue !== originalValue;

                          if (isLocalUser) {
                            confirmationModalDisclosure.onOpen();
                            return;
                          }
                          handleAdminPermission(adminPermissionInDraft);
                        }}>
                        Apply Changes
                      </Button>
                    )}
                  <Button
                    {...buttonStyles}
                    onClick={() => {
                      onClose();
                      setAdminPermissionTabInFocus(false);
                    }}>
                    Close
                  </Button>
                </HStack>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <ConfirmationModal
        onClose={confirmationModalDisclosure.onClose}
        isModalOpen={confirmationModalDisclosure.isOpen}
        headerText="Are You Sure?"
        bodyContent="You will remove Admin Permission for your own account!"
        onCloseBtnText="Close"
        onConfirm={async () => {
          handleAdminPermission(adminPermissionInDraft);
          navigate('/');
          onClose();
          confirmationModalDisclosure.onClose();
          dispatch(clearToken());
          dispatch(
            setUserData({
              _id: '',
              isAdmin: false,
              username: '',
              avatar: '',
              email: ''
            })
          );
        }}
        onConfirmBtnText="Confirm"></ConfirmationModal>
    </>
  );
};

export default AdminModal;
