import axios from 'axios';
import apiConfig from './index';

const cartSizeEndpoint = `${apiConfig.domain}/cart/getSize`;
const getCartItemsEndpoint = `${apiConfig.domain}/user/cart`;
const getAddBookToCartEndpoint = `${apiConfig.domain}/user/cart/add/`;
const deleteBookToCartEndpoint = `${apiConfig.domain}/user/cart/delete/`;

export async function getCartSize(token: string) {
  try {
    const response = await apiConfig.URL.get(cartSizeEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}
export async function getCartItems(token: string) {
  try {
    const response = await apiConfig.URL.get(getCartItemsEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}

export async function addBookToCart(token: string, bookId: string) {
  try {
    const response = await apiConfig.URL.post(`${getAddBookToCartEndpoint}${bookId}`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}

export async function removeBook(token: string, bookId: string) {
  try {
    const response = await apiConfig.URL.delete(`${deleteBookToCartEndpoint}${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}
