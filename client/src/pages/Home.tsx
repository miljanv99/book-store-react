import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect } from 'react';
import { getBooks } from '../services/Books';
import { Book } from '../model/Book.model';
import BookItem from '../components/book/BookItem';
import { COLORS } from '../globalColors';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTheNewestBooksList,
  selectTheBestRatedBooksList,
  selectTheMostPurchasedBooksList,
  setTheNewest,
  setTheBestRated,
  setTheMostPurchased
} from '../reducers/bookSlice';

const Home = () => {
  const dispatch = useDispatch();
  const theNewestBooks = useSelector(selectTheNewestBooksList);
  const theBestRatedBooks = useSelector(selectTheBestRatedBooksList);
  const theMostPurchasedBooks = useSelector(selectTheMostPurchasedBooksList);

  const fetchBooks = async () => {
    const newsetBooks: Book[] = await getBooks('sort={"creationDate":-1}&limit=5');
    const bestBooks: Book[] = await getBooks('sort={"currentRating":-1}&limit=5');
    const purchasedBooks: Book[] = await getBooks('sort={"purchasesCount":-1}&limit=5');
    dispatch(setTheNewest(newsetBooks));
    dispatch(setTheBestRated(bestBooks));
    dispatch(setTheMostPurchased(purchasedBooks));
  };

  useEffect(() => {
    if (
      theNewestBooks.length === 0 ||
      theBestRatedBooks.length === 0 ||
      theMostPurchasedBooks.length === 0
    ) {
      console.log('FETCHHHHH');
      fetchBooks();
    }
  }, []);

  return (
    <>
      {theNewestBooks.length === 0 ? (
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
            {theBestRatedBooks.map((book) => (
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
            {theMostPurchasedBooks.map((book) => (
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
