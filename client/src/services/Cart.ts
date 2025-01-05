import axios from 'axios';
import apiConfig from './index';

const cartSizeEndpoint = `${apiConfig.domain}/cart/getSize`;

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
