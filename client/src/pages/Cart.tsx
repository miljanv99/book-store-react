import {
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken } from '../reducers/authSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Book } from '../model/Book.model';
import {
  decrementCartCounter,
  emptyCartItems,
  removeCartItem,
  selectCartCounter,
  setCartCounter
} from '../reducers/cartSlice';
import { Cart } from '../model/Cart.model';
import { useToastHandler } from '../hooks/useToastHandler';
import emptyCartImg from '../assets/empty_cart.webp';
import CartItem from '../components/cart/CartItem';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { API_ROUTES } from '../constants/apiConstants';
import { ApiResponse } from '../model/ApiResponse.model';
import { Receipt } from '../model/Receipts.model';
import { COLORS } from '../globalColors';

const CartScreen = () => {
  const token = useSelector(selectAuthToken);
  const cartCounter = useSelector(selectCartCounter);
  const dispatch = useDispatch();
  const toast = useToastHandler();
  const navigate = useNavigate();
  const {
    isOpen: isCheckoutModalOpen,
    onOpen: onCheckoutModalOpen,
    onClose: onCheckoutModalClose
  } = useDisclosure();
  const {
    isOpen: isRemoveAllModalOpen,
    onOpen: onRemoveAllModalOpen,
    onClose: onRemoveAllModalClose
  } = useDisclosure();

  const [cartBooks, setCartBooks] = useState<Book[]>([]);
  const isCheckoutDisabled = cartBooks.some((book) => book.quantity === 0);
  const getCartItems = useApi<ApiResponse<Cart>>();
  const handleRemove = useApi<ApiResponse<string>>();
  const checkout = useApi<ApiResponse<Receipt>>();

  let booksInCart: Book[];

  const fetchCartItems = async () => {
    const cartItems = await getCartItems({
      method: 'GET',
      url: API_ROUTES.getCartItems
    });
    booksInCart = cartItems?.data.data.books;

    const booksInCartWithQuantity = booksInCart.map((book) => ({
      ...book,
      quantity: 1
    }));

    setCartBooks(booksInCartWithQuantity);
    console.log('BOOKS IN CART: ' + JSON.stringify(booksInCartWithQuantity, undefined, 2));
  };

  const handleQuantity = useCallback((bookId: string, value: number) => {
    // Parse to string to check if the number starts with 0
    let quantityValue: string = String(value);
    // Only remove leading zeros if value starts with 0 and has more than 1 digit
    if (quantityValue.startsWith('0')) {
      quantityValue = quantityValue.replace(/^0+/, '');
    }
    const parsed = parseInt(quantityValue);

    setCartBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === bookId
          ? { ...book, quantity: parsed > 99 ? 99 : Number.isNaN(parsed) ? 0 : parsed }
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
      handleRemove({
        method: 'DELETE',
        url: API_ROUTES.removeBookFromCart(id)
      })
        .then((res) => {
          setCartBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
          dispatch(decrementCartCounter());
          console.log('ID: ', id);
          dispatch(removeCartItem(id));
          const book = cartBooks.find((book) => book._id === id);
          const bookName = book && book.title;
          toast(`${bookName} has been removed from cart`, 'success', 'bottom');
          console.log(res?.status + '\n' + 'Book successfully removed');
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [dispatch, cartBooks, toast, token]
  );

  const handleRemoveAll = () => {
    handleRemove({
      method: 'DELETE',
      url: API_ROUTES.deleteAllFromCart
    })
      .then(() => {
        setCartBooks([]);
        dispatch(setCartCounter(0));
        dispatch(emptyCartItems());
        onRemoveAllModalClose();
        toast('You successfully empty the cart', 'success');
      })
      .catch((error) => console.error(error));
  };

  const handleCheckout = async () => {
    const getBookAndQuantity = cartBooks.reduce(
      (acc, book) => {
        acc[book._id] = book.quantity ?? 1;
        return acc;
      },
      {} as Record<string, number>
    );
    console.log('BOOKS ID AND QUANTITY: ' + JSON.stringify(getBookAndQuantity, undefined, 2));

    const response = await checkout({
      method: 'POST',
      url: API_ROUTES.checkout,

      data: getBookAndQuantity
    });
    console.log('AAA', response?.status);
    if (response?.status === 200) {
      dispatch(setCartCounter(0));
      navigate('/');
    }
    toast(response?.data.message, `${response?.status === 200 ? 'success' : 'error'}`);
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
              <HStack>
                {cartBooks.length > 1 ? (
                  <Button
                    _hover={{ bg: COLORS.darkRed }}
                    bg={COLORS.lightRed}
                    color={'white'}
                    onClick={onRemoveAllModalOpen}>
                    Remove All
                  </Button>
                ) : null}

                <Button
                  onClick={onCheckoutModalOpen}
                  isDisabled={isCheckoutDisabled}
                  _hover={{ bg: 'darkgreen' }}
                  bg={'green'}
                  color={'white'}>
                  Checkout
                </Button>
              </HStack>
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

      <ConfirmationModal
        isModalOpen={isRemoveAllModalOpen}
        onClose={onRemoveAllModalClose}
        headerText="Remove All Items"
        bodyText="Are you sure that you want to remove all items from cart?"
        onCloseBtnText="Cancel"
        onConfirm={handleRemoveAll}
        onConfirmBtnText="Yes, I am sure"></ConfirmationModal>

      <ConfirmationModal
        isModalOpen={isCheckoutModalOpen}
        onClose={onCheckoutModalClose}
        headerText={`You're about to purchase ${cartCounter} items for a total of $
            ${calculateTotalPrice.toFixed(2)}`}
        bodyText="Would you like to proceed with the checkout?"
        onCloseBtnText="Cancel"
        onConfirm={handleCheckout}
        onConfirmBtnText="Confirm Purchase"></ConfirmationModal>
    </>
  );
};

export default CartScreen;
