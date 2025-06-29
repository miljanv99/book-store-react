import { useDispatch, useSelector } from 'react-redux';
import { addBookToCart } from '../services/Cart';
import { useToastHandler } from '../hooks/useToastHandler';
import { selectAuthToken } from '../reducers/authSlice';
import { incrementCartCounter } from '../reducers/cartSlice';

export function useAddToCart() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const showToast = useToastHandler();

  const addToCart = async (bookID: string) => {
    const response = await addBookToCart(token!, bookID);
    showToast(
      response?.status === 200 || (response?.status === 400 && token)
        ? response?.data['message']
        : 'You have to login!',
      response?.status === 200 ? 'success' : 'error'
    );

    response?.status === 200 ? dispatch(incrementCartCounter()) : () => {};
  };

  return addToCart;
}
