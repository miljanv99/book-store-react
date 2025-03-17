import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { Book } from '../../model/Book.model';
import { COLORS } from '../../globalColors';
import { useNavigate } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import BookRating from './BookRating';
import { useDispatch, useSelector } from 'react-redux';
import { incrementCartCounter } from '../../reducers/cartSlice';
import { addBookToCart } from '../../services/Cart';
import { selectAuthToken } from '../../reducers/authSlice';
import { useToastHandler } from '../../hooks/useToastHandler';

function BookItem(props: Book) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const showToast = useToastHandler();

  const description = () => {
    let maxLength = 120;

    return props.description?.substring(0, maxLength) + '...';
  };

  function showBookDetails() {
    navigate(`/bookDetails/${props._id}`);
  }

  async function addToCart(bookID: string) {
    const response = await addBookToCart(token!, bookID);
    showToast(
      response?.status === 200 || (response?.status === 400 && token)
        ? response?.data['message']
        : 'You have to login!',
      response?.status === 200 ? 'success' : 'error'
    );

    response?.status === 200 ? dispatch(incrementCartCounter()) : () => {};
  }

  return (
    <Box background={COLORS.primaryColor} borderRadius={10} w={520} h={380} boxShadow={'2xl'}>
      <Flex>
        <Box display={'flex'} w={'50%'} h={350} alignItems="center" justifyContent={'center'}>
          <Image
            cursor={'pointer'}
            onClick={showBookDetails}
            borderRadius={5}
            w={200}
            h={300}
            src={props.cover}></Image>
        </Box>
        <Flex w={'50%'} direction={'column'} mt={5} p={2}>
          <Text fontWeight={'bolder'}>{props.title}</Text>
          <Text fontStyle={'italic'}>by {props.author}</Text>

          <BookRating rating={Number(props.currentRating)} />

          <Text>{Number(props.currentRating).toFixed(2)} rating</Text>
          <Text mt={5}>{description()}</Text>
          <Flex direction={'column'} flex={1} justifyContent={'space-evenly'}>
            <Button
              onClick={() => addToCart(props._id)}
              w={'90%'}
              colorScheme="green"
              leftIcon={<AddIcon />}>
              Add To Cart
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default BookItem;
