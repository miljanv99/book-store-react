import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Store from './pages/Store';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { loadToken, selectAuthToken } from './reducers/authSlice';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(loadToken());
    console.log('DISPATCH LOAD TOKEN: ' + token);

    console.log('LOADING TOKEN... ');
    if (token !== null) {
      console.log('TOKEN NOT NULL: '+ token);
      setLoading(false); 
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="store" element={<Store />} />
          <Route
            path="cart"
            element={
              <>
                {console.log('Token before rendering Cart:', token)}
                {loading ? (
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
                )}
              </>
            }
          />
          <Route path="bookDetails/:bookId" element={<BookDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
