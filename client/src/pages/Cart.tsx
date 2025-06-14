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
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import { useEffect, useMemo, useState } from 'react';
import { getCartItems } from '../services/Cart';
import { Book } from '../model/Book.model';
import { selectCartCounter } from '../reducers/cartSlice';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Cart } from '../model/Cart.model';

const CartScreen = () => {
  const token = useSelector(selectAuthToken);
  const cartCounter = useSelector(selectCartCounter);

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

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
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
        </HStack>
      </HStack>

      <Divider />

      {/* Cart Items */}
      <VStack width="100%">
        {cartBooks.map((book) => (
          <HStack mt={4} width="100%" key={book._id}>
            {/* Product Details */}
            <HStack width="50%">
              <Image w={120} src={book.cover}></Image>
              <VStack height={'100%'} alignItems={'start'} ml={5} spacing={8}>
                <Text>{book.title}</Text>
                <Text>{book.author}</Text>
                <Button>Remove</Button>
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
                    isNaN(book.quantity) || book.quantity === 0 || book.quantity > 99 ? 'red' : ''
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
            </HStack>
          </HStack>
        ))}
        <Text>{calculateTotalPrice.toFixed(2)}</Text>
      </VStack>
    </Flex>
  );
};

export default CartScreen;
