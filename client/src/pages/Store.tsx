import { Flex, Spinner, VStack, Wrap, Text, HStack, Button } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullBooksList, setAllBooks } from '../reducers/bookSlice';

import { useLocation, useSearchParams } from 'react-router-dom';
import AdvancedFilterPanel from '../components/advancedFilter/AdvancedFilterPanel';
import { StoreContext } from '../context/storeContext';
import SearchInput from '../components/advancedFilter/SearchInput';
import { useToastHandler } from '../hooks/useToastHandler';

type ApiBookResponse<T> = {
  data: T;
  message: string;
};

const Store = () => {
  const bookSkip = 0;
  const bookLimit = 30;
  const fetchAllBooks = useApi<ApiBookResponse<Book[]>>();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const allBooks = useSelector(selectFullBooksList);
  const [numberOfAllBooks, setNumberOfAllBooks] = useState<number>(0);
  const totalPages = Math.ceil(numberOfAllBooks / bookLimit);

  const { inputValue, setInputValue } = useContext(StoreContext);
  const [inputValueTemperary, setInputValueTemperary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const apiURL = new URL(API_ROUTES.getAllBooks, window.location.origin);
  const location = useLocation();
  const toast = useToastHandler();

  const fetchBooks = async () => {
    setIsLoading(true);

    const response = await fetchAllBooks({
      method: 'GET',
      url: `${apiURL.pathname}?${searchParams}`
    });

    if (response && response.status === 200) {
      dispatch(setAllBooks(response && response.data.data));
      setNumberOfAllBooks(response.data['itemsCountNoSkip']);

      setIsLoading(false);

      console.log('PARAMS: ', location.search);

      localStorage.setItem('search', location.search);
    } else {
      toast('Something went wrong', 'error', 'bottom');
    }
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

  const updateSearchParams = useCallback(
    (callback: (prev: URLSearchParams) => URLSearchParams) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        callback(next);
        return next;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    setSearchParams((params) => {
      if (!params.has('skip')) {
        params.set('skip', bookSkip.toString());
      }
      if (!params.has('limit')) {
        params.set('limit', bookLimit.toString());
      }
      return params;
    });
  }, []);

  //Fetch books
  useEffect(() => {
    console.log('FETCHHHHH STORE SCREEN');
    if (searchParams.has('genre')) {
      setSearchParams((prev) => {
        prev.set('skip', '0'); // reset pagination
        return prev;
      });
    }
    fetchBooks();
  }, [searchParams]);

  //Input search by query
  useEffect(() => {
    setSearchParams((params) => {
      if (inputValue) {
        params.set('query', JSON.stringify({ searchTerm: inputValue }));
        params.set('skip', '0'); // reset pagination
      }

      return params;
    });
  }, [inputValue]);

  useEffect(() => {
    const raw = searchParams.get('query');
    if (!raw) return;

    console.log('RAW: ', raw);
    const { searchTerm } = JSON.parse(raw);
    setInputValue(searchTerm);
    setInputValueTemperary(searchTerm);
  }, []);

  //Fetch all genres from allBooks
  useEffect(() => {
    fetchGenres();
  }, [allBooks]);

  return (
    <>
      <VStack justify={'center'} mt={'80px'}>
        <SearchInput
          inputValue={inputValue}
          inputValueTemperary={inputValueTemperary}
          searchParams={searchParams}
          setInputValue={setInputValue}
          setInputValueTemperary={setInputValueTemperary}
          setSearchParams={setSearchParams}
          setShowAdvancedFilters={setShowAdvancedFilters}
          showAdvancedFilters={showAdvancedFilters}></SearchInput>

        {(showAdvancedFilters || searchParams.size > 2) && (
          <AdvancedFilterPanel
            searchParams={searchParams}
            updateSearchParams={updateSearchParams}
            allGenres={allGenres}></AdvancedFilterPanel>
        )}
        {isLoading ? (
          <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
            <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
          </Flex>
        ) : !allBooks ? (
          <>
            <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
              <Text>Book Not Found</Text>
            </Flex>
          </>
        ) : (
          <VStack>
            <Wrap display={'flex'} justify={'center'}>
              {allBooks.map((book) => (
                <BookItem key={book._id} {...book}></BookItem>
              ))}
            </Wrap>
          </VStack>
        )}
        {numberOfAllBooks > 30 && numberOfAllBooks !== allBooks.length && (
          <HStack>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                onClick={() => {
                  const newSkip = bookLimit * index;
                  updateSearchParams((prev) => {
                    prev.set('skip', newSkip.toString());
                    prev.set('limit', bookLimit.toString());
                    return prev;
                  });

                  window.scrollTo({ top: 0 });
                }}>
                {index + 1}
              </Button>
            ))}
          </HStack>
        )}
      </VStack>
    </>
  );
};

export default Store;
