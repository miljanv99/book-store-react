import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Store from './pages/Store';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import { useSelector } from 'react-redux';
import { selectAuthToken } from './reducers/authSlice';
import UserProfile from './pages/UserProfile';

function App() {
  //const token = useSelector(selectAuthToken);
  const token = useSelector(selectAuthToken);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
