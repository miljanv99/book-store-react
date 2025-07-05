import axios from 'axios';
import { apiConfig, domain } from '.';

const cartSizeEndpoint = `${domain}/cart/getSize`;
const getCartItemsEndpoint = `${domain}/user/cart`;
const getAddBookToCartEndpoint = `${domain}/user/cart/add/`;
const deleteBookToCartEndpoint = `${domain}/user/cart/delete/`;
const checkoutEndpoint = `${domain}/user/cart/checkout`;

export async function getCartSize(token: string) {
  try {
    const response = await apiConfig.get(cartSizeEndpoint, {
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
    const response = await apiConfig.get(getCartItemsEndpoint, {
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
    const response = await apiConfig.post(`${getAddBookToCartEndpoint}${bookId}`, undefined, {
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
    const response = await apiConfig.delete(`${deleteBookToCartEndpoint}${bookId}`, {
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

export async function checkout(token: string, books: Record<string, number>) {
  try {
    const response = await apiConfig.post(`${checkoutEndpoint}`, books, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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
