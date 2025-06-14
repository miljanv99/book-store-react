import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  cartCounter: 0
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
    }
  }
});

export const { setCartCounter, incrementCartCounter, decrementCartCounter } =
  CartCounterSlice.actions;

export const selectCartCounter = (state: RootState) => state.cartCounterItem.cartCounter;

export default CartCounterSlice.reducer;
