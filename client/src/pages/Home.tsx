import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Book } from '../model/Book.model';
import BookItem from '../components/book/BookItem';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheNewestBooksList, setTheNewest } from '../reducers/bookSlice';

const Home = () => {
  const handleBooks = useApi<ApiResponse<Book[]>>();

  const [bestRatedBooks, setBestRatedBooks] = useState<Book[]>([]);
  const [mostPurchasedBooks, setMostPurchasedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const theNewestBooks = useSelector(selectTheNewestBooksList);
  const dispatch = useDispatch();

  const fetchBooks = async () => {
    setIsLoading(true);
    const newest = await handleBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"creationDate": -1}&limit=5`
    });
    const bestRated = await handleBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"currentRating":-1}&limit=5`
    });
    const mostPurchase = await handleBooks({
      method: 'GET',
      url: `${API_ROUTES.getAllBooks}?sort={"purchasesCount":-1}&limit=5`
    });

    dispatch(setTheNewest(newest && newest.data.data));

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
            {theNewestBooks.map((book) => (
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
