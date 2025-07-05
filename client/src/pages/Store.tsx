import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { searchBookEndpoint } from '../services/Books';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';

type ApiBookResponse = {
  message: string;
  data: Book[];
  itemCount: number;
};

const Store = () => {
  const { data, sendRequest } = useApi<ApiBookResponse>();

  const fetchBooks = async () => {
    sendRequest({ method: 'GET', url: searchBookEndpoint });
  };

  useEffect(() => {
    console.log('FETCHHHHH STORE SCREEN');
    fetchBooks();
  }, []);

  return (
    <>
      {data === null ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text mt={20}>Store Page</Text>
          <Wrap display={'flex'} justify={'center'}>
            {data['data'].map((book) => (
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

export default Store;
