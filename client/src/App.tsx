import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Store from './pages/Store';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from './reducers/authSlice';
import UserProfile from './pages/UserProfile';
import { AddIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import { buttonStyles } from './globalStyles';
import { COLORS } from './globalColors';
import BookModal from './components/modals/BookModal';

function App() {
  const token = useSelector(selectAuthToken);
  const isAdmin = useSelector(selectUserData).isAdmin;
  const location = useLocation();
  const currentPath = location.pathname;
  const showFloatingButton = ['/', '/store'].includes(currentPath);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {isAdmin && showFloatingButton && (
        <IconButton
          as={AddIcon}
          zIndex={1}
          {...buttonStyles}
          backgroundColor={COLORS.darkerPrimaryColor}
          width={'60px'}
          height={'60px'}
          position={'fixed'}
          bottom={'50px'}
          left={'92%'}
          borderRadius={30}
          aria-label={'floating_button_add'}
          padding={'12px'}
          onClick={onOpen}>
          Add Now Book
        </IconButton>
      )}
      {/* Modal for adding new books */}
      <BookModal isOpen={isOpen} onClose={onClose}></BookModal>

      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route path="cart" element={token ? <Cart /> : <Navigate to="/" replace />} />
          <Route path="bookDetails/:bookId" element={<BookDetails />} />
          <Route
            path="profile/:username"
            element={token ? <UserProfile /> : <Navigate to="/" replace />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
