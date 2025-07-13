import { Flex, Input, Spinner, VStack, Wrap, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
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
  const { data: bookData, sendRequest } = useApi<ApiBookResponse>();
  const [searchValue, setSearchValue] = useState('');

  const fetchBooks = async () => {
    await sendRequest({ method: 'GET', url: searchBookEndpoint });
  };

  const filteredBooks = useMemo(() => {
    if (searchValue === '') {
      return bookData?.data;
    }

    const query = searchValue.toLowerCase().split(' ');

    return bookData?.data.filter((book) => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      return query.every((word) => title.includes(word) || author.includes(word));
    });
  }, [bookData?.data, searchValue]);

  useEffect(() => {
    console.log('FETCHHHHH STORE SCREEN');
    fetchBooks();
  }, []);

  return (
    <>
      <VStack justify={'center'}>
        <Input
          width={500}
          mb={8}
          mt={'80px'}
          placeholder="Enter Title or Author"
          onChange={(e) => setSearchValue(e.target.value)}></Input>
        {!filteredBooks ? (
          <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
            <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
          </Flex>
        ) : filteredBooks.length === 0 ? (
          <>
            <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
              <Text>Book Not Found</Text>
            </Flex>
          </>
        ) : (
          <VStack>
            <Wrap display={'flex'} justify={'center'}>
              {filteredBooks.map((book) => (
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
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default Store;
