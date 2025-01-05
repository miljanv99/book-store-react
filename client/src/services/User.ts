import axios from 'axios';
import apiConfig from './index';

const userLoginEndpoint = `${apiConfig.domain}/user/login`;
const userRegisterEndpoint = `${apiConfig.domain}/user/register`;
const userProfileEndpoint = `${apiConfig.domain}/user/profile/`;

export async function userLogin(username: string, password: string) {
  try {
    const response = await apiConfig.URL.post(userLoginEndpoint, {
      username: username,
      password: password
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract the error message and response if available
      return error.response; // Return the response object in case of an error
    } else {
      throw error; // Re-throw the error if it's not an AxiosError
    }
  }
}

export async function userRegister(
  email: string,
  username: string,
  password: string,
  confirm: string,
  avatar?: string
) {
  try {
    const response = await apiConfig.URL.post(userRegisterEndpoint, {
      email: email,
      username: username,
      password: password,
      confirmPassword: confirm,
      avatar: avatar
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract the error message and response if available
      return error.response; // Return the response object in case of an error
    } else {
      throw error; // Re-throw the error if it's not an AxiosError
    }
  }
}

export async function userProfile(token: string, username: string) {
  try {
    const response = await apiConfig.URL.get(`${userProfileEndpoint}${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    //console.log("PROFILE: "+ JSON.stringify(response, undefined, 2));
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}
