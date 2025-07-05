import { apiConfig, domain } from '.';
import { Book } from '../model/Book.model';

export const searchBookEndpoint = '/book/search';
const getSingleBookEndpoint = `${domain}/book/details/`;
const rateBookEndpoint = `${domain}/book/rate/`;
const addToFavoritesEndpoint = `${domain}/book/addToFavorites/`;

export async function getBooks(query?: string): Promise<Book[]> {
  try {
    const response = await apiConfig.get(`${searchBookEndpoint}?${query}`);
    return response.data.data;
  } catch (error) {
    console.log('Error while getting books');
    throw error;
  }
}

export async function getSingleBook(bookID: string): Promise<Book> {
  try {
    const response = await apiConfig.get(`${getSingleBookEndpoint}${bookID}`);
    console.log('Book Details: ' + response.data.data['title']);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
