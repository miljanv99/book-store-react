import { Divider, Flex, Heading, HStack, Image, Stack, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCartItems, removeBook } from '../services/Cart';
import { Book } from '../model/Book.model';
import { decrementCartCounter, selectCartCounter } from '../reducers/cartSlice';
import { Cart } from '../model/Cart.model';
import { useToastHandler } from '../hooks/useToastHandler';
import emptyCartImg from '../assets/empty_cart.webp';
import CartItem from '../components/cart/CartItem';

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

  const handleQuantity = useCallback((bookId: string, value: number) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) => (book._id === bookId ? { ...book, quantity: value } : book))
    );
  }, []);

  const handleIncrement = useCallback((bookId: string) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? isNaN(book.quantity!)
            ? { ...book, quantity: 1 }
            : { ...book, quantity: book.quantity! + 1 }
          : book
      )
    );
  }, []);

  const handleDecrement = useCallback((bookId: string) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId ? { ...book, quantity: book.quantity! - 1 } : book
      )
    );
  }, []);

  const calculateTotalPrice = useMemo<number>(() => {
    const newTotalPrice = cartBooks.reduce(
      (previousBookValue, currentBookValue) =>
        previousBookValue + currentBookValue.price * currentBookValue.quantity!,
      0
    );

    console.log('YYYY: ' + newTotalPrice);
    return newTotalPrice;
  }, [cartBooks]);

  const handleRemoveItem = useCallback(
    (id: string) => {
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
    },
    [dispatch, cartBooks, toast, token]
  );

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
          <CartItem
            books={cartBooks}
            calculateTotalPrice={calculateTotalPrice}
            handleDecrement={handleDecrement}
            handleIncrement={handleIncrement}
            handleQuantity={handleQuantity}
            handleRemoveItem={handleRemoveItem}></CartItem>
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
