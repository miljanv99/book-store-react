import { Flex, Input, Spinner, VStack, Wrap, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullBooksList, setAllBooks } from '../reducers/bookSlice';

type ApiBookResponse<T> = {
  data: T;
  message: string;
};

const Store = () => {
  const fetchAllBooks = useApi<ApiBookResponse<Book[]>>();

  const dispatch = useDispatch();
  const allBooks = useSelector(selectFullBooksList);

  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);
    const response = await fetchAllBooks({ method: 'GET', url: API_ROUTES.getAllBooks });

    dispatch(setAllBooks(response && response.data.data));

    setIsLoading(false);
  };

  const filteredBooks = useMemo(() => {
    if (searchValue === '') {
      return allBooks;
    }

    const query = searchValue.toLowerCase().split(' ');

    return allBooks.filter((book) => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      return query.every((word) => title.includes(word) || author.includes(word));
    });
  }, [allBooks, searchValue]);

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
        {isLoading ? (
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
                <BookItem key={book._id} {...book}></BookItem>
              ))}
            </Wrap>
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default Store;
