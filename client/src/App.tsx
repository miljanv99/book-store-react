import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Store from './pages/Store';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from './reducers/authSlice';
import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import { buttonStyles } from './globalStyles';
import { COLORS } from './globalColors';
import BookModal from './components/modals/BookModal';
import { NewPassword } from './pages/NewPassword';
import { StoreProvider } from './context/storeContext';
import Analytics from './pages/Analytics';
import UserProfile from './pages/UserProfile';
import UserDetails from './pages/userList/UserDetails';
import UserList from './pages/userList/UserList';
import { ROUTES } from './constants/routes';
import ImportBooksModal from './components/modals/ImportBooksModal';
import { FaFileImport } from 'react-icons/fa6';

function App() {
  const token = useSelector(selectAuthToken);
  const isAdmin = useSelector(selectUserData).isAdmin;
  const location = useLocation();
  const currentPath = location.pathname;
  const showFloatingButton = ['/', '/store'].includes(currentPath);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const importModalDisclosure = useDisclosure();

  return (
    <>
      {isAdmin && showFloatingButton && (
        <Tooltip label="Add New Books">
          <Box width={'60px'} height={'60px'} position={'fixed'} bottom={'50px'} left={'92%'}>
            <Menu>
              <MenuButton>
                <IconButton
                  as={AddIcon}
                  width={'100%'}
                  height={'100%'}
                  zIndex={1}
                  {...buttonStyles}
                  backgroundColor={COLORS.darkerPrimaryColor}
                  borderRadius={30}
                  aria-label={'floating_button_add'}
                  padding={'12px'}>
                  Add Now Book
                </IconButton>
              </MenuButton>

              <Portal>
                <MenuList>
                  <MenuItem onClick={onOpen}>
                    <HStack>
                      <AddIcon />
                      <Text>Add Single Book</Text>
                    </HStack>
                  </MenuItem>
                  <MenuItem onClick={importModalDisclosure.onOpen}>
                    <HStack>
                      <FaFileImport />
                      <Text>Import Books</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Tooltip>
      )}
      {/* Modal for adding new books */}
      <BookModal isOpen={isOpen} onClose={onClose}></BookModal>
      {/* Modal for import new books */}
      <ImportBooksModal importModalDisclosure={importModalDisclosure}></ImportBooksModal>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigation />}>
          <Route index element={<Home />} />
          <Route
            path={ROUTES.STORE}
            element={
              <StoreProvider>
                <Store />
              </StoreProvider>
            }
          />
          <Route path={ROUTES.CART} element={token ? <Cart /> : <Navigate to="/" replace />} />
          <Route path={ROUTES.BOOK_DETAILS} element={<BookDetails />} />
          <Route
            path={ROUTES.PROFILE}
            element={token ? <UserProfile /> : <Navigate to="/" replace />}></Route>
          <Route
            path={ROUTES.ANALYTICS}
            element={token ? <Analytics /> : <Navigate to="/" />}></Route>
          <Route
            path={ROUTES.USERS_LIST.USERS}
            element={token && isAdmin ? <UserList /> : <Navigate to="/" />}>
            <Route
              path={ROUTES.USERS_LIST.USER_DETAILS}
              element={token && isAdmin ? <UserDetails /> : <Navigate to="/" />}
            />
          </Route>
        </Route>
        <Route path={ROUTES.RESTART_PASSWORD} element={<NewPassword></NewPassword>}></Route>
      </Routes>
    </>
  );
}

export default App;
