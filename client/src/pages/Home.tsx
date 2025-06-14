import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getBooks } from '../services/Books';
import { Book } from '../model/Book.model';
import BookItem from '../components/book/BookItem';
import { COLORS } from '../globalColors';

const Home = () => {
  const [books, setBooks] = useState({
    theNewest: [] as Book[],
    theBestRated: [] as Book[],
    theMostPurchased: [] as Book[]
  });

  const fetchBooks = async () => {
    let newsetBooks: Book[] = await getBooks('sort={"creationDate":-1}&limit=5');
    let bestBooks: Book[] = await getBooks('sort={"currentRating":-1}&limit=5');
    let purchasedBooks: Book[] = await getBooks('sort={"purchasesCount":-1}&limit=5');
    setBooks({
      theNewest: newsetBooks,
      theBestRated: bestBooks,
      theMostPurchased: purchasedBooks
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      {books.theNewest.length === 0 ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text {...headerText} mt={20}>
            The Newset Books
          </Text>
          <Wrap display={'flex'} justify={'center'}>
            {books.theNewest.map((book) => (
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
            {books.theBestRated.map((book) => (
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
            {books.theMostPurchased.map((book) => (
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
