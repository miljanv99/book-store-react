import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react';
import { Book } from '../model/Book.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COLORS } from '../globalColors';
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
import { Comment } from '../model/Comment.model';
import React from 'react';
import { formattedDate } from '../utils/formatDate';
import CommentItem from '../components/comment/CommentItem';
import { buttonStyles } from '../globalStyles';

type ApiResponseComment<T> = {
  message: string;
  totalCount: number;
  data?: T;
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
  const getBookComments = useApi<ApiResponseComment<Comment[]>>();
  const addBookComment = useApi<ApiResponse<Comment>>();

  const [singleBook, setSingleBook] = useState<Book>();
  const [profileData, setProfileData] = useState<User>();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [numberOfComment, setNumberOfComment] = useState<number>(0);
  const [inputCommentInFocus, setInputCommentInFocus] = useState<boolean>(false);
  const [inputCommentValue, setInputCommentValue] = useState<string>('');
  const COMMENTS_LIMIT = 10;
  const [skipCount, setSkipCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const getBookDetails = async () => {
    const response = await getSingleBook({
      method: 'GET',
      url: API_ROUTES.getSingleBook(`${bookId}`)
    });
    setSingleBook(response?.data.data!);
  };

  const getComments = async () => {
    setLoading(true);
    try {
      const response = await getBookComments({
        method: 'GET',
        url: API_ROUTES.getComments(bookId!, skipCount)
      });

      setSkipCount((prev) => prev + COMMENTS_LIMIT);

      const fetchedComments = response?.data.data;
      const totalCount = response?.data.totalCount;

      console.log('BOOKS: ', fetchedComments);
      setComments((prev) => [...prev, ...fetchedComments]);
      setNumberOfComment(totalCount);

      console.log('SKIP COUNT: ', skipCount);
      console.log('TOTAL COUNT: ', totalCount);

      if (totalCount > 10) {
        setHasMore(true);
      }

      if (totalCount < skipCount) {
        console.log('NO MORE COMMENTS');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error during fetching commets!', error);
    }
    setLoading(false);
  };

  const checkIfBookIsFavorite = useMemo<boolean>(() => {
    return favoriteBooks.some((book) => book._id === bookId) ?? false;
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

  const addNewComment = () => {
    addBookComment({
      method: 'POST',
      url: API_ROUTES.addComment(bookId!),
      headers: { Authorization: `Bearer ${token}` },
      data: {
        content: inputCommentValue
      }
    })
      .then((res) => {
        const newComment: Comment = {
          _id: res?.data.data._id,
          book: res?.data.data.book,
          content: inputCommentValue,
          creationDate: new Date(),
          user: profileData!
        };

        setComments((prev) => [newComment, ...prev]);
        setInputCommentValue('');
        setInputCommentInFocus(false);
        setNumberOfComment((prev) => prev + 1);
        toast('Comment posted successfully!', 'success');
      })
      .catch((error) => {
        toast(error, 'error');
        console.error(error);
      });
  };

  useEffect(() => {
    getBookDetails();
    getComments();
    scrollTo({ top: 0 });
  }, [token]);

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
    console.log('FAVORITE BOOKS !!!!!!');

    if (profileData?.favoriteBooks) {
      setFavoriteBooks(profileData.favoriteBooks);
    }

    console.log('FAVORITE BOOKS !!!!!!: ', favoriteBooks);
  }, [profileData]);

  useEffect(() => {
    if (favoriteMessage !== '') {
      toast(favoriteMessage, 'success');
    }
  }, [favoriteMessage]);

  //observe the skeleton element for fetching additional comments
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          console.log('Element is visible!');
          setTimeout(() => {
            getComments();
          }, 1000);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      console.log('TRIGGER OBSERVE');
      observer.observe(loaderRef.current);
    }

    return () => {
      console.log('CLEAN UP');
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  if (!singleBook) {
    return <Text>Book with this ID: ${bookId} does not exist!</Text>;
  }

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

                  <BookRating
                    bookId={singleBook._id}
                    calledInComponent={BookDetails}
                    currentRating={Number(singleBook.currentRating)}
                    ratedBy={singleBook.ratedBy}
                    size={30}
                  />

                  <Text>Number Of Purachases: {singleBook.purchasesCount}</Text>
                </Box>
                <Text fontSize={'xx-large'}>{singleBook.price}$</Text>
              </Flex>
            </Box>
            <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-evenly'}>
              <Text>{singleBook.description}</Text>
              <Flex flexDirection={'column'} alignItems={'stretch'}>
                <Text>Added To Store: {formattedDate(singleBook.creationDate!)}</Text>
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

      <VStack w="70%" mx={'auto'} mt={'18px'}>
        <VStack w={'100%'} alignItems={'start'}>
          <Text fontSize={'x-large'}>
            {numberOfComment} {numberOfComment > 1 ? 'Comments' : 'Comment'}
          </Text>
          {token ? (
            <HStack w={'100%'} mb={'25px'}>
              <Avatar boxSize={'50px'} src={userDataSelector.avatar}></Avatar>
              <Input
                value={inputCommentValue}
                name="comment_input"
                placeholder="Add a comment"
                border={'none'}
                borderBottom={'1px solid'}
                borderRadius={'none'}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  setInputCommentValue(inputValue);
                }}
                onClick={() => setInputCommentInFocus(true)}
                _focus={{ boxShadow: 'none' }}></Input>
            </HStack>
          ) : null}

          {inputCommentInFocus ? (
            <>
              <HStack w={'100%'} justifyContent={'end'}>
                <Button
                  {...buttonStyles}
                  onClick={() => {
                    setInputCommentInFocus(false);
                    setInputCommentValue('');
                  }}>
                  Cancel
                </Button>
                <Button {...buttonStyles} isDisabled={!inputCommentValue} onClick={addNewComment}>
                  Comment
                </Button>
              </HStack>
            </>
          ) : null}
        </VStack>

        <VStack width={'100%'} alignItems={'start'} spacing={'25px'}>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment}></CommentItem>
          ))}
        </VStack>
        {hasMore ? (
          <VStack ref={loaderRef} width="100%">
            <Skeleton height="12px" width="120px" />
            <Skeleton height="14px" width="100%" />
          </VStack>
        ) : null}
      </VStack>
    </>
  );
};

BookDetails.displayName = 'BookDetails';

export default BookDetails;
