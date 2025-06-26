import { Box, Button, Flex, IconButton, Image, Text } from '@chakra-ui/react';
import { Book } from '../model/Book.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSingleBook } from '../services/Books';
import { COLORS } from '../globalColors';
import { format } from 'date-fns';
import BookRating from '../components/book/BookRating';
import { ArrowBackIcon } from '@chakra-ui/icons';

const buttonStyles = {
  color: 'black',
  borderRadius: 20,
  backgroundColor: COLORS.primaryColor
};

const BookDetails = () => {
  const { bookId } = useParams();
  const navigation = useNavigate();

  const [book, setBook] = useState<Book | null>();

  const getBookDetails = async () => {
    let response = await getSingleBook(bookId!);
    console.log('Book Instance: ', JSON.stringify(response, null, 2));
    setBook(response);
  };

  useEffect(() => {
    getBookDetails();
  }, [bookId]);

  if (!book) {
    return <Text>Book with this ID: ${bookId} does not exist!</Text>;
  }

  const formattedDate = book.creationDate
    ? format(new Date(book.creationDate), 'dd MMMM yyyy')
    : '';

  const handleGoBack = () => {
    navigation(-1);
  };

  return (
    <>
      <Box pt={20}>
        <IconButton
          boxSize={12}
          icon={<ArrowBackIcon />}
          aria-label="back_arrow"
          bg={COLORS.primaryColor}
          color={'white'}
          onClick={handleGoBack}></IconButton>
        <Flex w="60%" mx={'auto'}>
          <Image
            boxShadow={'0px 8px 10px rgba(0, 0, 0, 0.25)'}
            borderRadius={10}
            w={{ base: '100%', sm: '80%', md: '60%', lg: '50%', xl: '40%' }}
            h={{ base: 'auto', sm: 'auto', md: '500px', lg: '600px', xl: '750px' }}
            src={book.cover}
            alt={book.title}
          />
          <Flex textAlign={'justify'} flexDirection="column" ml={5}>
            <Text fontWeight="bold" fontSize="xx-large">
              {book.title}
            </Text>
            <Box>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                  <Text fontSize="x-large">{book.author}</Text>

                  <BookRating rating={Number(book.currentRating)} size={30} />

                  <Text>Number Of Purachases: {book.purchasesCount}</Text>
                </Box>
                <Text fontSize={'xx-large'}>{book.price}$</Text>
              </Flex>
            </Box>
            <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-evenly'}>
              <Text>{book.description}</Text>
              <Flex flexDirection={'column'} alignItems={'stretch'}>
                <Text>Added To Store: {formattedDate}</Text>
                <Text>Genre: {book.genre}</Text>
                <Text>ISBN: {book.isbn}</Text>
                <Text>Pages: {book.pagesCount}</Text>
              </Flex>
              <Flex mt={4} gap={2}>
                <Button {...buttonStyles}>Add To Cart</Button>
                <Button {...buttonStyles}>Add To Favorite</Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default BookDetails;
