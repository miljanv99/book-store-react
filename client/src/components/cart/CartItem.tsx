import { MinusIcon, AddIcon } from '@chakra-ui/icons';
import { VStack, HStack, IconButton, Input, Button, Image, Text } from '@chakra-ui/react';
import { Book } from '../../model/Book.model';
import React from 'react';

interface CartItemProps {
  books: Book[];
  handleQuantity: (bookId: string, value: number) => void;
  handleDecrement: (bookId: string) => void;
  handleIncrement: (bookId: string) => void;
  handleRemoveItem: (bookId: string) => void;
  calculateTotalPrice: number;
}

const CartItem: React.FC<CartItemProps> = ({
  books,
  handleQuantity,
  handleDecrement,
  handleIncrement,
  handleRemoveItem,
  calculateTotalPrice
}) => {
  const isCheckoutDisabled = books.some((book) => book.quantity === 0);

  return (
    <VStack width="100%" fontSize={'larger'}>
      {books.map((book) => (
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
                  isNaN(book.quantity) || book.quantity === 0 || book.quantity > 99 ? 'red' : ''
                }
                focusBorderColor={
                  isNaN(book.quantity) || book.quantity === 0 || book.quantity > 99 ? 'red.500' : ''
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
        <Button
          isDisabled={isCheckoutDisabled}
          _hover={{ bg: 'darkgreen' }}
          bg={'green'}
          color={'white'}>
          Checkout
        </Button>
      </VStack>
    </VStack>
  );
};

export default React.memo(CartItem);
