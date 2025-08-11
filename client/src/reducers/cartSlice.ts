import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface cartState {
  cartCounter: number;
  cartItemsBookId: string[];
}

const initialState: cartState = {
  cartCounter: 0,
  cartItemsBookId: []
};

export const CartCounterSlice = createSlice({
  name: 'cartCounter',
  initialState,
  reducers: {
    setCartCounter: (state, action: PayloadAction<number>) => {
      state.cartCounter = action.payload;
    },
    incrementCartCounter: (state) => {
      state.cartCounter += 1;
    },
    decrementCartCounter: (state) => {
      state.cartCounter -= 1;
    },
    setCartItems: (state, action: PayloadAction<string[]>) => {
      state.cartItemsBookId = action.payload;
    },
    addCartItem: (state, action: PayloadAction<string>) => {
      state.cartItemsBookId.push(action.payload);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItemsBookId = state.cartItemsBookId.filter((bookId) => bookId !== action.payload);
    },
    emptyCartItems: (state) => {
      state.cartItemsBookId = [];
    }
  }
});

export const {
  setCartCounter,
  incrementCartCounter,
  decrementCartCounter,
  setCartItems,
  addCartItem,
  removeCartItem,
  emptyCartItems
} = CartCounterSlice.actions;

export const selectCartCounter = (state: RootState) => state.cart.cartCounter;
export const selectCartItemsBookId = (state: RootState) => state.cart.cartItemsBookId;

export default CartCounterSlice.reducer;
