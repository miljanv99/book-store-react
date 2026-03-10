import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react';
import { Book } from '../../model/Book.model';
import { COLORS } from '../../globalColors';
import { useNavigate } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import BookRating from './BookRating';
import { useAddToCart } from '../../hooks/useAddToCart';
import { ROUTES } from '../../constants/routes';
import { FiTrendingDown } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reducers/authSlice';
import { MdCancel } from 'react-icons/md';

function BookItem(props: Book) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const isAdmin = useSelector(selectUserData).isAdmin;

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
      boxShadow={'2xl'}
      position={'relative'}>
      {isAdmin && props.stock <= 5 ? (
        <VStack
          width={'55px'}
          height={'45px'}
          gap={0}
          justifyContent={'center'}
          position={'absolute'}
          right={-2}
          top={-2}
          backgroundColor={COLORS.lightRed}
          borderRadius={'20px'}>
          <Text fontSize={'xs'} fontWeight={'bold'}>
            Stock
          </Text>
          {props.stock !== 0 ? (
            <FiTrendingDown color={COLORS.darkRed} />
          ) : (
            <MdCancel color={COLORS.darkRed} />
          )}
        </VStack>
      ) : (
        !isAdmin &&
        props.stock === 0 && (
          <VStack
            width={'55px'}
            height={'45px'}
            gap={0}
            justifyContent={'center'}
            position={'absolute'}
            right={-2}
            top={-2}
            backgroundColor={COLORS.lightRed}
            borderRadius={'20px'}>
            <Text fontSize={'xs'} fontWeight={'bold'}>
              Stock
            </Text>
            <MdCancel color={COLORS.darkRed} />
          </VStack>
        )
      )}
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
              isDisabled={props.stock === 0}
              _hover={{ backgroundColor: COLORS.lightGreenColor }}
              _active={{
                backgroundColor: COLORS.greenColor
              }}
              textColor={'white'}
              onClick={() => addToCart(props._id)}
              w={'90%'}
              backgroundColor={COLORS.greenColor}
              leftIcon={props.stock === 0 ? <MdCancel color={COLORS.darkRed} /> : <AddIcon />}>
              {props.stock === 0 ? 'Out Of Stock' : 'Add To Cart'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

BookItem.displayName = 'BookItem';

export default BookItem;
