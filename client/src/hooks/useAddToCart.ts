import { useDispatch, useSelector } from 'react-redux';
import { useToastHandler } from '../hooks/useToastHandler';
import { selectAuthToken } from '../reducers/authSlice';
import { incrementCartCounter } from '../reducers/cartSlice';
import { useApi } from './useApi';
import { API_ROUTES } from '../constants/apiConstants';

export function useAddToCart() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const addToCartApi = useApi<Record<string, string>>();
  const showToast = useToastHandler();

  const addToCart = async (bookID: string) => {
    const response = await addToCartApi({
      method: 'POST',
      url: API_ROUTES.addBookToCart(bookID),
      headers: { Authorization: `Bearer ${token}` }
    });
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
