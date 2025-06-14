import { Flex, Spinner, Text, Wrap } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import BookItem from '../components/book/BookItem';
import { Book } from '../model/Book.model';
import { getBooks } from '../services/Books';
import { COLORS } from '../globalColors';

const Store = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    let allBooks: Book[] = await getBooks();
    setBooks(allBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      {books.length === 0 ? (
        <Flex height="100vh" justifyContent={'center'} alignItems={'center'}>
          <Spinner size={'xl'} color={COLORS.primaryColor}></Spinner>
        </Flex>
      ) : (
        <>
          <Text mt={20}>Store Page</Text>
          <Wrap display={'flex'} justify={'center'}>
            {books.map((book) => (
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
