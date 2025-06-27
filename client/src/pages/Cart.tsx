import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkout, getCartItems, removeBook } from '../services/Cart';
import { Book } from '../model/Book.model';
import { decrementCartCounter, selectCartCounter, setCartCounter } from '../reducers/cartSlice';
import { Cart } from '../model/Cart.model';
import { useToastHandler } from '../hooks/useToastHandler';
import emptyCartImg from '../assets/empty_cart.webp';
import CartItem from '../components/cart/CartItem';
import { useNavigate } from 'react-router-dom';

const CartScreen = () => {
  const token = useSelector(selectAuthToken);
  const cartCounter = useSelector(selectCartCounter);
  const dispatch = useDispatch();
  const toast = useToastHandler();
  const navigate = useNavigate();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const [cartBooks, setCartBooks] = useState<Book[]>([]);
  const isCheckoutDisabled = cartBooks.some((book) => book.quantity === 0);

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
    console.log('BOOKS IN CART: ' + JSON.stringify(booksInCartWithQuantity, undefined, 2));
  };

  const handleQuantity = useCallback((bookId: string, value: number) => {
    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? { ...book, quantity: value > 99 ? 99 : Number.isNaN(value) ? 0 : value }
          : book
      )
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

  const handleCheckout = async () => {
    const getBookAndQuantity = cartBooks.reduce(
      (acc, book) => {
        acc[book._id] = book.quantity ?? 1;
        return acc;
      },
      {} as Record<string, number>
    );
    console.log('BOOKS ID AND QUANTITY: ' + JSON.stringify(getBookAndQuantity, undefined, 2));

    const response = await checkout(token!, getBookAndQuantity);

    if (response?.status === 200) {
      dispatch(setCartCounter(0));
      navigate('/');
      toast(response.data['message'], 'success');
    } else {
      toast('Something went wrong, please contact our support center', 'error');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <>
      {cartCounter !== 0 ? (
        <>
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
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
              handleQuantity={handleQuantity}
              handleRemoveItem={handleRemoveItem}></CartItem>

            <VStack width={'100%'} alignItems={'end'} fontSize={'x-large'} fontWeight={'bold'}>
              <HStack>
                <Text>Total Amount:</Text>
                <Text>${calculateTotalPrice.toFixed(2)}</Text>
              </HStack>
              <Button
                onClick={onModalOpen}
                isDisabled={isCheckoutDisabled}
                _hover={{ bg: 'darkgreen' }}
                bg={'green'}
                color={'white'}>
                Checkout
              </Button>
            </VStack>
          </Flex>
        </>
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

      <Modal isCentered={true} isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader textAlign={'center'}>
            You're about to purchase {cartCounter} items for a total of $
            {calculateTotalPrice.toFixed(2)}.
          </ModalHeader>
          <ModalBody>
            <Center>Would you like to proceed with the checkout?</Center>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'center'}>
              <Button onClick={handleCheckout}>Confirm Purchase</Button>
              <Button onClick={onModalClose}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CartScreen;
