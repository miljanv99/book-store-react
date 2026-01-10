import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { Book } from '../../model/Book.model';
import { COLORS } from '../../globalColors';
import { useNavigate } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import BookRating from './BookRating';
import { useAddToCart } from '../../hooks/useAddToCart';
import { ROUTES } from '../../constants/routes';

function BookItem(props: Book) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const description = () => {
    let maxLength = 120;

    return props.description.length > maxLength
      ? props.description?.substring(0, maxLength) + '...'
      : props.description;
  };

  function showBookDetails() {
    navigate(ROUTES.BOOK_DETAILS_DYNAMIC_PATH(props._id));
  }

  return (
    <Box
      textColor={'black'}
      background={COLORS.primaryColor}
      borderRadius={10}
      w={520}
      h={380}
      boxShadow={'2xl'}>
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

          <BookRating calledInComponent={BookItem} currentRating={Number(props.currentRating)} />

          <Text height={'100%'} mt={5}>
            {description()}
          </Text>
          <Flex direction={'column'} flex={1} justifyContent={'space-evenly'}>
            <Button
              _hover={{ backgroundColor: COLORS.lightGreenColor }}
              _active={{
                backgroundColor: COLORS.greenColor
              }}
              textColor={'white'}
              onClick={() => addToCart(props._id)}
              w={'90%'}
              backgroundColor={COLORS.greenColor}
              leftIcon={<AddIcon />}>
              Add To Cart
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

BookItem.displayName = 'BookItem';

export default BookItem;
