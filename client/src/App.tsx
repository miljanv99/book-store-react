import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Store from './pages/Store';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { selectAuthToken } from './reducers/authSlice';

function App() {
  //const token = useSelector(selectAuthToken);
  const [loading, setLoading] = useState(true);
  const token = useSelector(selectAuthToken);

  useEffect(() => {
    !token ? setLoading(true) : setLoading(false);
    console.log('DISPATCH LOAD TOKEN: ' + token);

    setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route
            path="cart"
            element={
              loading ? (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  size="xl"
                  alignSelf="center"
                  margin="auto"
                  display="block"
                />
              ) : token ? (
                <Cart />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="bookDetails/:bookId" element={<BookDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
