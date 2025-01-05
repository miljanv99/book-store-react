import apiConfig from './index';
import { Book } from '../model/Book.model';

const searchBookEndpoint = `${apiConfig.domain}/book/search`;
const getSingleBookEndpoint = `${apiConfig.domain}/book/details/`;
const rateBookEndpoint = `${apiConfig.domain}/book/rate/`;
const addToFavoritesEndpoint = `${apiConfig.domain}/book/addToFavorites/`;

export async function getBooks(query?: string): Promise<Book[]> {
  try {
    const response = await apiConfig.URL.get(`${searchBookEndpoint}?${query}`);
    return response.data.data;
  } catch (error) {
    console.log('Error while getting books');
    throw error;
  }
}

export async function getSingleBook(bookID: string): Promise<Book> {
  try {
    const response = await apiConfig.URL.get(`${getSingleBookEndpoint}${bookID}`);
    console.log('Book Details: ' + response.data.data['title']);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
