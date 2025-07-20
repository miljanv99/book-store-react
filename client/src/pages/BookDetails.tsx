import { Box, Button, Flex, HStack, IconButton, Image, Text } from '@chakra-ui/react';
import { Book } from '../model/Book.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../globalColors';
import { format } from 'date-fns';
import BookRating from '../components/book/BookRating';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useAddToCart } from '../hooks/useAddToCart';
import { FaHeart } from 'react-icons/fa6';
import { useApi } from '../hooks/useApi';
import { User } from '../model/User.model';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import { useToastHandler } from '../hooks/useToastHandler';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';

const buttonStyles = {
  color: 'black',
  borderRadius: 20,
  backgroundColor: COLORS.primaryColor
};

const BookDetails = () => {
  const { bookId } = useParams();
  const navigation = useNavigate();
  const addToCart = useAddToCart();
  const userDataSelector = useSelector(selectUserData);
  const token = useSelector(selectAuthToken);
  const toast = useToastHandler();

  const getProfileData = useApi<ApiResponse<User>>();
  const toggleFavorite = useApi<ApiResponse<void>>();
  const getSingleBook = useApi<ApiResponse<Book>>();

  const [singleBook, setSingleBook] = useState<Book>();
  const [profileData, setProfileData] = useState<User>();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  const getBookDetails = async () => {
    const response = await getSingleBook({
      method: 'GET',
      url: API_ROUTES.getSingleBook(`${bookId}`)
    });
    setSingleBook(response?.data.data!);
  };

  const checkIfBookIsFavorite = useMemo<boolean>(() => {
    return favoriteBooks?.some((book) => book._id === bookId) ?? false;
  }, [favoriteBooks, bookId]);

  const toggleFavoriteBook = async () => {
    const response = await toggleFavorite({
      method: 'POST',
      url: API_ROUTES.addBookToFavorite(`${bookId}`),
      headers: { Authorization: `Bearer ${token}` }
    });
    setFavoriteBooks((prev) => {
      const alreadyFavorite = prev.some((book) => book._id === bookId);
      if (alreadyFavorite) {
        return prev?.filter((book) => book._id !== bookId);
      } else {
        return [...prev!, singleBook!];
      }
    });

    setFavoriteMessage(response?.data.message!);
  };

  useEffect(() => {
    getBookDetails();
  }, [bookId]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileData({
          method: 'GET',
          url: API_ROUTES.getProfile(userDataSelector.username),
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfileData(response?.data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (token) {
      fetchProfile();
      console.log('Fetched profile data');
    }
  }, [token]);

  useEffect(() => {
    setFavoriteBooks(profileData?.favoriteBooks!);
  }, [profileData]);

  useEffect(() => {
    if (favoriteMessage !== '') {
      toast(favoriteMessage, 'success');
    }
  }, [favoriteMessage]);

  if (!singleBook) {
    return <Text>Book with this ID: ${bookId} does not exist!</Text>;
  }

  const formattedDate = singleBook.creationDate
    ? format(new Date(singleBook.creationDate), 'dd MMMM yyyy')
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
            src={singleBook.cover}
            alt={singleBook.title}
          />
          <Flex textAlign={'justify'} flexDirection="column" ml={5}>
            <HStack align={'center'}>
              <Text fontWeight="bold" fontSize="xx-large" textAlign={'center'}>
                {singleBook.title}
              </Text>
              {token ? (
                <>
                  <IconButton
                    onClick={toggleFavoriteBook}
                    backgroundColor={'transparent'}
                    aria-label="favorite"
                    icon={
                      <FaHeart
                        size={'30px'}
                        color={checkIfBookIsFavorite === true ? 'red' : 'white'}></FaHeart>
                    }></IconButton>
                </>
              ) : null}
            </HStack>
            <Box>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                  <Text fontSize="x-large">{singleBook.author}</Text>

                  <BookRating rating={Number(singleBook.currentRating)} size={30} />

                  <Text>Number Of Purachases: {singleBook.purchasesCount}</Text>
                </Box>
                <Text fontSize={'xx-large'}>{singleBook.price}$</Text>
              </Flex>
            </Box>
            <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-evenly'}>
              <Text>{singleBook.description}</Text>
              <Flex flexDirection={'column'} alignItems={'stretch'}>
                <Text>Added To Store: {formattedDate}</Text>
                <Text>Genre: {singleBook.genre}</Text>
                <Text>ISBN: {singleBook.isbn}</Text>
                <Text>Pages: {singleBook.pagesCount}</Text>
              </Flex>
              <Flex mt={4} gap={2}>
                <Button {...buttonStyles} onClick={() => addToCart(singleBook._id)}>
                  Add To Cart
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default BookDetails;
