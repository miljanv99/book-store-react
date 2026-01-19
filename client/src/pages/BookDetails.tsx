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
  Tooltip,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { Book } from '../model/Book.model';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COLORS } from '../globalColors';
import BookRating from '../components/book/BookRating';
import { ArrowBackIcon, EditIcon } from '@chakra-ui/icons';
import { useAddToCart } from '../hooks/useAddToCart';
import { FaHeart } from 'react-icons/fa6';
import { useApi } from '../hooks/useApi';
import { User } from '../model/User.model';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../reducers/authSlice';
import { useToastHandler } from '../hooks/useToastHandler';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { Comment } from '../model/Comment.model';
import React from 'react';
import { formattedDate } from '../utils/formatDate';
import CommentItem from '../components/comment/CommentItem';
import { buttonStyles } from '../globalStyles';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { decrementCartCounter, removeCartItem, selectCartItemsBookId } from '../reducers/cartSlice';
import BookModal from '../components/modals/BookModal';

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
  const cartItemsBookId = useSelector(selectCartItemsBookId);
  const toast = useToastHandler();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal
  } = useDisclosure();

  const dispatch = useDispatch();

  const getProfileData = useApi<ApiResponse<User>>();
  const toggleFavorite = useApi<ApiResponse<void>>();
  const handleBook = useApi<ApiResponse<Book>>();
  const getBookComments = useApi<ApiResponseComment<Comment[]>>();
  const handleBookCommnt = useApi<ApiResponse<Comment>>();
  const removeCommentItem = useApi<ApiResponse<string>>();

  const [singleBook, setSingleBook] = useState<Book>();
  const [profileData, setProfileData] = useState<User>();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [isBookInCart, setIsBookInCart] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [numberOfComment, setNumberOfComment] = useState<number>(0);
  const [inputCommentInFocus, setInputCommentInFocus] = useState<boolean>(false);
  const [inputCommentValue, setInputCommentValue] = useState<string>('');
  const COMMENTS_LIMIT = 10;
  const [skipCount, setSkipCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editCommentRef, setEditCommentRef] = useState<Record<string, string>>();
  const inputRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const getBookDetails = async () => {
    const response = await handleBook({
      method: 'GET',
      url: API_ROUTES.getSingleBook(`${bookId}`)
    });
    setSingleBook(response && response.data.data);
  };

  const getComments = async () => {
    setLoading(true);
    try {
      const response = await getBookComments({
        method: 'GET',
        url: API_ROUTES.getComments(bookId!, skipCount)
      });

      setSkipCount((prev) => prev + COMMENTS_LIMIT);

      const fetchedComments = response && response.data.data;
      const totalCount = response && response.data.totalCount;

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
  }, [favoriteBooks, bookId, token]);

  const toggleFavoriteBook = async () => {
    try {
      const response = await toggleFavorite({
        method: 'POST',
        url: API_ROUTES.addBookToFavorite(`${bookId}`),
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteBooks((books) => {
        const alreadyFavorite = books.some((book) => book._id === bookId);
        if (alreadyFavorite) {
          return books.filter((book) => book._id !== bookId);
        } else {
          return [...books, singleBook!];
        }
      });
      toast(response && response.data.message, 'success');
    } catch (error) {
      console.log(error);
    }
  };

  const addNewComment = () => {
    handleBookCommnt({
      method: 'POST',
      url: API_ROUTES.addComment(bookId!),
      data: {
        content: inputCommentValue
      }
    })
      .then((res) => {
        if (res && res.status === 401) {
          toast(res && res.data.message, 'error', 'bottom');
          return;
        }
        if (res && profileData) {
          const newComment: Comment = {
            _id: res.data.data._id,
            book: res.data.data.book,
            content: inputCommentValue,
            creationDate: new Date(),
            user: profileData
          };
          console.log('AAAAAA: ', profileData);
          setComments((prev) => [newComment, ...prev]);
          setInputCommentValue('');
          setInputCommentInFocus(false);
          setNumberOfComment((prev) => prev + 1);
          toast('Comment posted successfully!', 'success');
        }
      })
      .catch((error) => {
        toast(error, 'error');
        console.error(error);
      });
  };

  const removeComment = useCallback(
    (commentId: string) => {
      removeCommentItem({
        method: 'DELETE',
        url: API_ROUTES.deleteComment(commentId),
        headers: { Authorization: `Bearer ${token}` }
      }).then((res) => {
        if (res && res.status === 200) {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
          setNumberOfComment((prev) => prev - 1);
          toast(res.data.message, 'success', 'bottom');
        }
      });
    },
    [token, removeCommentItem]
  );

  const editComment = (commentId: string) => {
    handleBookCommnt({
      method: 'PUT',
      url: API_ROUTES.editComment(commentId),
      data: {
        content: inputCommentValue
      }
    }).then((res) => {
      if (res && res.status !== 200) {
        toast(res.data.errors.content, 'error', 'bottom');
        return;
      }

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: `${inputCommentValue} (edited)` }
            : comment
        )
      );
      toast(res && res.data.message, 'success', 'bottom');
      setInputCommentInFocus(false);
      setInputCommentValue('');
      setIsEdit(false);
    });
  };

  useEffect(() => {
    getBookDetails();
    getComments();
    scrollTo({ top: 0 });
  }, [token]);

  useEffect(() => {
    if (isEdit && editCommentRef) {
      // Defer focus until after Chakra's menu closes
      const [, content] = Object.entries(editCommentRef)[0];
      setTimeout(() => {
        inputRef.current && (inputRef.current.focus(), inputRef.current.scrollTo());

        setInputCommentInFocus(true);
        setInputCommentValue(content);
      }, 50);
    }
  }, [isEdit]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfileData({
          method: 'GET',
          url: API_ROUTES.getProfile(userDataSelector.username)
        });

        setProfileData(response && response.data.data);
        setFavoriteBooks(response && response.data.data.favoriteBooks);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    if (token && userDataSelector.username) {
      fetchProfile();
      console.log('Fetched profile data');
    }
  }, [token, userDataSelector.username]);

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
        <Flex justifyContent={'center'}>
          <Box position={'relative'} p={'10px'}>
            <Box>
              {userDataSelector.isAdmin && (
                <IconButton
                  {...buttonStyles}
                  boxSize={12}
                  position={'absolute'}
                  right={'0px'}
                  top={'0px'}
                  aria-label="edit_icon"
                  onClick={onOpenEditModal}
                  icon={<EditIcon boxSize={6} />}></IconButton>
              )}
              <Image
                boxShadow={'0px 8px 10px rgba(0, 0, 0, 0.25)'}
                borderRadius={10}
                width={'400px'}
                src={singleBook.cover}
                alt={singleBook.title}
              />
            </Box>
          </Box>
          <Flex width={'600px'} textAlign={'justify'} flexDirection="column" ml={5}>
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
                  <Text>Year: {singleBook.year}</Text>
                </Box>
                <Text fontSize={'xx-large'}>{singleBook.price}$</Text>
              </Flex>
            </Box>
            <Flex h={'100%'} flexDirection={'column'} justifyContent={'space-evenly'}>
              <Text>
                Plot: <br />
                {singleBook.description}
              </Text>
              <Flex flexDirection={'column'} alignItems={'stretch'}>
                <Text>Added To Store: {formattedDate(singleBook.creationDate!)}</Text>
                <Text>Genre: {singleBook.genre}</Text>
                <Text>ISBN: {singleBook.isbn}</Text>
                <Text>Pages: {singleBook.pagesCount}</Text>
              </Flex>
              <Flex mt={4} gap={2}>
                <Button
                  {...buttonStyles}
                  onClick={async () => {
                    await addToCart(singleBook._id);
                  }}>
                  Add To Cart
                </Button>
                {userDataSelector.isAdmin && (
                  <Button
                    {...buttonStyles}
                    _hover={{ bg: COLORS.darkRed }}
                    bg={COLORS.lightRed}
                    _active={{ bg: COLORS.darkRed }}
                    onClick={() => {
                      const bookIsInCart = cartItemsBookId.some((id) => id === bookId);
                      setIsBookInCart(bookIsInCart);
                      onOpen();
                    }}>
                    Remove From Store
                  </Button>
                )}
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
                ref={inputRef}
                value={inputCommentValue}
                name="comment_input"
                placeholder="Add a comment"
                border={'none'}
                borderBottom={'1px solid'}
                borderRadius={'none'}
                onBlur={() => setInputCommentInFocus(false)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  setInputCommentValue(inputValue);
                }}
                onClick={() => setInputCommentInFocus(true)}
                _focus={{ boxShadow: 'none' }}></Input>
            </HStack>
          ) : null}

          {inputCommentInFocus && profileData ? (
            <>
              <HStack w={'100%'} justifyContent={'end'}>
                <Button
                  {...buttonStyles}
                  onClick={() => {
                    setInputCommentInFocus(false);
                    setInputCommentValue('');
                    setIsEdit(false);
                  }}>
                  Cancel
                </Button>
                {
                  <Tooltip
                    textAlign={'center'}
                    label={
                      profileData.isCommentsBlocked &&
                      `You do not have permission to add comments. Please contact admin support.`
                    }>
                    <Button
                      {...buttonStyles}
                      isDisabled={!inputCommentValue || profileData.isCommentsBlocked}
                      onClick={
                        !isEdit
                          ? addNewComment
                          : () => {
                              const [commentID] = Object.keys(editCommentRef!);
                              editComment(commentID);
                            }
                      }>
                      {isEdit ? 'Save' : 'Comment'}
                    </Button>
                  </Tooltip>
                }
              </HStack>
            </>
          ) : null}
        </VStack>

        <VStack width={'100%'} alignItems={'start'} spacing={'25px'}>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              setIsEdit={setIsEdit}
              setEditCommentRef={setEditCommentRef}
              removeComment={removeComment}
              isCommentBlocked={profileData?.isCommentsBlocked ?? false}></CommentItem>
          ))}
        </VStack>
        {hasMore ? (
          <VStack ref={loaderRef} width="100%">
            <Skeleton height="12px" width="120px" />
            <Skeleton height="14px" width="100%" />
          </VStack>
        ) : null}
      </VStack>

      <ConfirmationModal
        isModalOpen={isOpen}
        onClose={onClose}
        headerText={isBookInCart ? 'The book is in your cart!' : 'Are you sure?'}
        bodyContent={
          <Text>
            <>
              <strong>{singleBook.title}</strong> will be removed permanently from{' '}
              <strong>store, other user's cart</strong>
              {isBookInCart && (
                <>
                  {' and'}
                  <strong> your cart</strong>
                </>
              )}
              !
            </>
          </Text>
        }
        onCloseBtnText="Cancel"
        onConfirmBtnText="Confirm"
        onConfirm={async () => {
          try {
            onClose();
            if (isBookInCart) {
              //remove book id from redux state and decrement the cart counter
              dispatch(removeCartItem(`${bookId}`));
              dispatch(decrementCartCounter());
            }

            const response = await handleBook({
              method: 'DELETE',
              url: API_ROUTES.deleteBook(`${bookId}`)
            });
            toast(`${response && response.data.message}`, 'success');
            navigation('/');
          } catch (error) {
            console.error(error);
          }
        }}></ConfirmationModal>

      <BookModal
        isOpen={isOpenEditModal}
        onClose={onCloseEditModal}
        isEdit={true}
        initialBook={singleBook}
        editedBook={setSingleBook}></BookModal>
    </>
  );
};

BookDetails.displayName = 'BookDetails';

export default BookDetails;
