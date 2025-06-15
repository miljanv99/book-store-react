import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { getBooks } from '../services/Books';
import { COLORS } from '../globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { selectFullBooksList, setAllBooks } from '../reducers/bookSlice';

const Store = () => {
  const fullBookList = useSelector(selectFullBooksList);
  const dispatch = useDispatch();

  const fetchBooks = async () => {
    const allBooks: Book[] = await getBooks();
    dispatch(setAllBooks(allBooks));
  };

  useEffect(() => {
    if (fullBookList.length === 0) {
      console.log('FETCHHHHH STORE SCREEN');
      fetchBooks();
    }
  }, []);

  return (
    <>
      {fullBookList.length === 0 ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text mt={20}>Store Page</Text>
          <Wrap display={'flex'} justify={'center'}>
            {fullBookList.map((book) => (
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
