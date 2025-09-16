import {
  Flex,
  Input,
  Spinner,
  VStack,
  Wrap,
  Text,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { useContext, useEffect, useMemo, useState } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullBooksList, setAllBooks } from '../reducers/bookSlice';
import { FiFilter } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import AdvancedFilterPanel from '../components/advancedFilter/AdvancedFilterPanel';
import { StoreContext } from '../context/storeContext';

type ApiBookResponse<T> = {
  data: T;
  message: string;
};

const Store = () => {
  const fetchAllBooks = useApi<ApiBookResponse<Book[]>>();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const allBooks = useSelector(selectFullBooksList);

  const { inputValue, setInputValue } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  const fetchBooks = async () => {
    setIsLoading(true);

    const url = new URL(API_ROUTES.getAllBooks, window.location.origin);

    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    console.log('URL: ', url);
    const response = await fetchAllBooks({
      method: 'GET',
      url: `${url.pathname}${url.search}`
    });

    dispatch(setAllBooks(response && response.data.data));

    setIsLoading(false);
  };

  const fetchGenres = async () => {
    const response = await fetchAllBooks({
      method: 'GET',
      url: API_ROUTES.getAllBooks
    });

    const books: Book[] = response && response.data.data;
    const genres = Array.from(new Set(books.flatMap((book) => book.genre)));

    setAllGenres(genres);
  };

  const filteredBooks = useMemo(() => {
    console.log('TEST: ', inputValue);
    if (inputValue === '') {
      return allBooks;
    }

    const query = inputValue.toLowerCase().split(' ');

    return allBooks.filter((book) => {
      const title = book.title.toLowerCase();
      const author = book.author.toLowerCase();
      return query.every((word) => title.includes(word) || author.includes(word));
    });
  }, [allBooks, inputValue]);

  //Fetch books
  useEffect(() => {
    console.log('FETCHHHHH STORE SCREEN');
    fetchBooks();
  }, [searchParams]);

  //Fetch all genres from allBooks
  useEffect(() => {
    fetchGenres();
  }, [allBooks]);

  return (
    <>
      <VStack justify={'center'} mt={'80px'}>
        <InputGroup width={'500px'}>
          <Input
            width={500}
            value={inputValue}
            mb={showAdvancedFilters || searchParams.size > 0 ? 0 : 8}
            placeholder="Enter Title or Author"
            onChange={(e) => setInputValue(e.target.value)}></Input>
          <InputRightElement>
            <IconButton
              backgroundColor={'transparent'}
              aria-label={'advanced_filter'}
              icon={<FiFilter />}
              isDisabled={searchParams.size > 0}
              onClick={() => {
                setShowAdvancedFilters((prev) => !prev);
              }}
              size="md"
            />
          </InputRightElement>
        </InputGroup>
        {(showAdvancedFilters || searchParams.size > 0) && (
          <AdvancedFilterPanel
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            allGenres={allGenres}></AdvancedFilterPanel>
        )}
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
