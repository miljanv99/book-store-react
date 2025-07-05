import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import { searchBookEndpoint } from '../services/Books';
import { Book } from '../model/Book.model';
import BookItem from '../components/book/BookItem';
import { COLORS } from '../globalColors';

import { useApi } from '../hooks/useApi';

type ApiBookResponse = {
  message: string;
  data: Book[];
  itemCount: number;
};

const Home = () => {
  const { data: theNewestBooks1, sendRequest: fetchTheNewestBooks } = useApi<ApiBookResponse>();
  const { data: theBestRatedBooks1, sendRequest: fetchTheBestRatedBooks } =
    useApi<ApiBookResponse>();
  const { data: theMostPurchasedBooks1, sendRequest: fetchTheMostPurchasedBooksBooks } =
    useApi<ApiBookResponse>();

  const fetchBooks = () => {
    fetchTheNewestBooks({
      method: 'GET',
      url: `${searchBookEndpoint}?sort={"creationDate":-1}&limit=5`
    });
    fetchTheBestRatedBooks({
      method: 'GET',
      url: `${searchBookEndpoint}?sort={"currentRating":-1}&limit=5`
    });
    fetchTheMostPurchasedBooksBooks({
      method: 'GET',
      url: `${searchBookEndpoint}?sort={"purchasesCount":-1}&limit=5`
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      {theNewestBooks1 === null ||
      theBestRatedBooks1 === null ||
      theMostPurchasedBooks1 === null ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text {...headerText} mt={20}>
            The Newset Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {theNewestBooks1['data'].map((book: any) => (
              <BookItem
                key={book._id}
                _id={book._id}
                cover={book.cover}
                title={book.title}
                author={book.author}
                currentRating={book.currentRating}
                description={book.description}
                genre={book.genre}
                price={book.price}
                year={book.year}
                pagesCount={book.pagesCount}></BookItem>
            ))}
          </Wrap>
          <Text {...headerText} mt={5}>
            The Best Rated Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {theBestRatedBooks1['data'].map((book) => (
              <BookItem
                key={book._id}
                _id={book._id}
                cover={book.cover}
                title={book.title}
                author={book.author}
                currentRating={book.currentRating}
                description={book.description}
                genre={book.genre}
                price={book.price}
                year={book.year}
                pagesCount={book.pagesCount}></BookItem>
            ))}
          </Wrap>

          <Text {...headerText} mt={5}>
            The Most Purchased Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {theMostPurchasedBooks1['data'].map((book) => (
              <BookItem
                key={book._id}
                _id={book._id}
                cover={book.cover}
                title={book.title}
                author={book.author}
                currentRating={book.currentRating}
                description={book.description}
                genre={book.genre}
                price={book.price}
                year={book.year}
                pagesCount={book.pagesCount}></BookItem>
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
