import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Book } from '../model/Book.model';
import BookItem from '../components/book/BookItem';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { useSelector } from 'react-redux';
import { selectUserData } from '../reducers/authSlice';

const Home = () => {
  const fetchTheNewestBooks = useApi<ApiResponse<Book[]>>();
  const fetchTheBestRatedBooks = useApi<ApiResponse<Book[]>>();
  const fetchTheMostPurchasedBooksBooks = useApi<ApiResponse<Book[]>>();

  const [newestBooks, setNewestBooks] = useState<Book[]>([]);
  const [bestRatedBooks, setBestRatedBooks] = useState<Book[]>([]);
  const [mostPurchasedBooks, setMostPurchasedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = useSelector(selectUserData).isAdmin;

  const fetchBooks = async () => {
    setIsLoading(true);
    const newest = await fetchTheNewestBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"creationDate":-1}&limit=5`
    });
    const bestRated = await fetchTheBestRatedBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"currentRating":-1}&limit=5`
    });
    const mostPurchase = await fetchTheMostPurchasedBooksBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"purchasesCount":-1}&limit=5`
    });

    setNewestBooks(newest?.data.data!);
    setBestRatedBooks(bestRated?.data.data!);
    setMostPurchasedBooks(mostPurchase?.data.data!);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      {isLoading ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text {...headerText} mt={20}>
            The Newset Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {newestBooks.map((book: any) => (
              <BookItem key={book._id} {...book}></BookItem>
            ))}
          </Wrap>
          <Text {...headerText} mt={5}>
            The Best Rated Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {bestRatedBooks.map((book) => (
              <BookItem key={book._id} {...book}></BookItem>
            ))}
          </Wrap>

          <Text {...headerText} mt={5}>
            The Most Purchased Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {mostPurchasedBooks.map((book) => (
              <BookItem key={book._id} {...book}></BookItem>
            ))}
          </Wrap>
        </>
      )}
    </>
  );
};

const headerText = {
  textAlign: 'center' as const,
  fontSize: 'xx-large',
  mb: 5
};

export default Home;
