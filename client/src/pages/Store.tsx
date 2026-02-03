import { Flex, Spinner, VStack, Wrap, Text, HStack, Button } from '@chakra-ui/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { COLORS } from '../globalColors';
import { useApi } from '../hooks/useApi';
import { API_ROUTES } from '../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullBooksList, setAllBooks } from '../reducers/bookSlice';

import { useSearchParams } from 'react-router-dom';
import AdvancedFilterPanel from '../components/advancedFilter/AdvancedFilterPanel';
import { StoreContext } from '../context/storeContext';
import SearchInput from '../components/advancedFilter/SearchInput';

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

  const fetchBooks = async () => {
    let urlSearchTerm = '';
    setIsLoading(true);

    if (inputValue === '') {
      setSearchParams((prev) => {
        prev.delete('query');
        return prev;
      });
    }
    if (searchParams) {
      if (searchParams.has('genre') || searchParams.has('query')) {
        setSearchParams((prev) => {
          prev.set('skip', bookSkip.toString());
          return prev;
        });
      }

      if (searchParams.has('query')) {
        const raw = searchParams.get('query');
        console.log('RAW: ', raw);
        urlSearchTerm = raw && JSON.parse(raw).searchTerm;
        setInputValueTemperary(urlSearchTerm);
        setInputValue(urlSearchTerm);
      }
    }

    if (!searchParams.has('skip') && !searchParams.has('limit')) {
      console.log('NO PARAMS');
      setSearchParams({ skip: bookSkip.toString(), limit: bookLimit.toString() });
    }

    console.log('SEARCH PARAMS: ', searchParams);
    const response = await fetchAllBooks({
      method: 'GET',
      url: `${apiURL.pathname}?${searchParams}`
    });
    console.log('URLaaaaa: ', `${apiURL.pathname}${apiURL.search}`);
    console.log('search params: ', searchParams);

    if (response && response.status === 200) {
      dispatch(setAllBooks(response && response.data.data));
      setNumberOfAllBooks(response.data['itemsCountNoSkip']);

      setIsLoading(false);
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
      setSearchParams((prevParams) => {
        const next = callback(new URLSearchParams(prevParams));
        return next;
      });
    },
    [setSearchParams]
  );

  //Fetch books
  useEffect(() => {
    console.log('FETCHHHHH STORE SCREEN');
    fetchBooks();
  }, [searchParams]);

  //Input search by query
  useEffect(() => {
    updateSearchParams((prev) => {
      prev.set('query', JSON.stringify({ searchTerm: inputValue }));
      return prev;
    });

    localStorage.setItem('search', `${`{"searchTerm": "${inputValue}"}`}`);
  }, [inputValue]);

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
            setInputValueTemperary={setInputValueTemperary}
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
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set('skip', newSkip.toString());
                    newParams.set('limit', bookLimit.toString());
                    return newParams;
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
