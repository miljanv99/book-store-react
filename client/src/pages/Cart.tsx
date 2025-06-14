import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import { useEffect, useMemo, useState } from 'react';
import { getCartItems, removeBook } from '../services/Cart';
import { Book } from '../model/Book.model';
import { decrementCartCounter, selectCartCounter } from '../reducers/cartSlice';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Cart } from '../model/Cart.model';
import { useToastHandler } from '../hooks/useToastHandler';
import emptyCartImg from '../assets/empty cart.jpg';

const CartScreen = () => {
  const token = useSelector(selectAuthToken);
  const cartCounter = useSelector(selectCartCounter);
  const dispatch = useDispatch();
  const toast = useToastHandler();

  const [cartBooks, setCartBooks] = useState<Book[]>([]);

  let cartItems: Cart;
  let booksInCart: Book[];

  const fetchCartItems = async () => {
    cartItems = await getCartItems(token!);
    booksInCart = cartItems['books'];

    const booksInCartWithQuantity = booksInCart.map((book) => ({
      ...book,
      quantity: 1
    }));

    setCartBooks(booksInCartWithQuantity);
  };

  const handleQuantity = (bookId: string, value: number) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) => (book._id === bookId ? { ...book, quantity: value } : book))
    );
  };

  const handleIncrement = (bookId: string) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? isNaN(book.quantity)
            ? { ...book, quantity: 1 }
            : { ...book, quantity: book.quantity + 1 }
          : book
      )
    );
  };

  const handleDecrement = (bookId: string) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId ? { ...book, quantity: book.quantity - 1 } : book
      )
    );
  };

  const calculateTotalPrice = useMemo<number>(() => {
    const newTotalPrice = cartBooks.reduce(
      (previousBookValue, currentBookValue) =>
        previousBookValue + currentBookValue.price * currentBookValue.quantity,
      0
    );

    console.log('YYYY: ' + newTotalPrice);
    return newTotalPrice;
  }, [cartBooks]);

  const handleRemoveItem = (id: string) => {
    removeBook(token!, id)
      .then((res) => {
        setCartBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
        dispatch(decrementCartCounter());
        const book = cartBooks.find((book) => book._id === id);
        const bookName = book?.title;
        toast(`${bookName} has been removed from cart`, 'success', 'bottom');
        console.log(res?.status + '\n' + 'Book successfully removed');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      {cartCounter !== 0 ? (
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          padding={20}
          maxWidth={1920}
          margin="0 auto">
          <Stack width="100%">
            <HStack justifyContent="space-between">
              <Heading size="xl">Shopping Cart</Heading>
              <Heading>
                {cartCounter} {cartCounter > 1 ? 'Items' : 'Item'}
              </Heading>
            </HStack>
          </Stack>

          <Divider borderWidth="thin" borderColor="black" mb={8} />

          {/* Headers */}
          <HStack width="100%">
            <Text width="50%">PRODUCT DETAILS</Text>
            <HStack width="50%" justifyContent="space-between">
              <Text width="160px" textAlign="center">
                QUANTITY
              </Text>
              <Text width="80px" textAlign="center">
                PRICE
              </Text>
              <Text width="80px" textAlign="center">
                TOTAL
              </Text>
              {/* For Remove button */}
              <Text width="80px" textAlign="center"></Text>
            </HStack>
          </HStack>

          <Divider />

          {/* Cart Items */}
          <VStack width="100%" fontSize={'larger'}>
            {cartBooks.map((book) => (
              <HStack
                _hover={{ bg: 'whitesmoke' }}
                borderRadius={10}
                mt={4}
                width="100%"
                key={book._id}
                paddingRight={2}
                paddingLeft={2}>
                {/* Product Details */}
                <HStack width="50%">
                  <Image w={120} src={book.cover} borderRadius={5}></Image>
                  <VStack height={'100%'} alignItems={'start'} ml={5} spacing={4}>
                    <Text>{book.title}</Text>
                    <Text>{book.author}</Text>
                  </VStack>
                </HStack>

                {/* Quantity, Price, and Total */}
                <HStack width="50%" justifyContent="space-between">
                  {/* Quantity Section */}
                  <HStack width="160px" justifyContent="center">
                    <IconButton
                      isDisabled={book.quantity === 0 || isNaN(book.quantity) ? true : false}
                      aria-label="cart"
                      icon={<MinusIcon />}
                      onClick={() => handleDecrement(book._id)}></IconButton>
                    <Input
                      borderColor={
                        isNaN(book.quantity) || book.quantity === 0 || book.quantity > 99
                          ? 'red'
                          : ''
                      }
                      focusBorderColor={
                        isNaN(book.quantity) || book.quantity === 0 || book.quantity > 99
                          ? 'red.500'
                          : ''
                      }
                      type="number"
                      textAlign="center"
                      value={book.quantity}
                      onChange={(e) => handleQuantity(book._id, parseInt(e.target.value))}></Input>
                    <IconButton
                      isDisabled={book.quantity >= 99 ? true : false}
                      aria-label="cart"
                      icon={<AddIcon />}
                      onClick={() => handleIncrement(book._id)}></IconButton>
                  </HStack>

                  {/* Price */}
                  <Text width="80px" textAlign="center">
                    ${book.price}
                  </Text>

                  {/* Total */}
                  <Text width="80px" textAlign="center">
                    ${(book.price * (isNaN(book.quantity) ? 1 : book.quantity)).toFixed(2)}
                  </Text>

                  <Button
                    onClick={() => handleRemoveItem(book._id)}
                    _hover={{ bg: 'rgb(180, 0, 0)' }}
                    bg={'rgb(245, 57, 54)'}
                    color={'white'}>
                    Remove
                  </Button>
                </HStack>
              </HStack>
            ))}
            <VStack width={'100%'} alignItems={'end'} fontSize={'x-large'} fontWeight={'bold'}>
              <HStack>
                <Text>Total Amount:</Text>
                <Text>{calculateTotalPrice.toFixed(2)}</Text>
              </HStack>
              <Button _hover={{ bg: 'darkgreen' }} bg={'green'} color={'white'}>
                Checkout
              </Button>
            </VStack>
          </VStack>
        </Flex>
      ) : (
        <Flex
          height={'100vh'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}>
          <Image src={emptyCartImg} width={420} height={420}></Image>
          <Text fontSize={'x-large'}>You're Cart Is Empty</Text>
        </Flex>
      )}
    </>
  );
};

export default CartScreen;
