import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../model/Book.model';
import { RootState } from '../store';

interface BooksState {
  theNewest: Book[];
  theBestRated: Book[];
  theMostPurchased: Book[];
  FullList: Book[];
}

const initialState: BooksState = {
  theNewest: [],
  theBestRated: [],
  theMostPurchased: [],
  FullList: []
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setTheNewest: (state, action: PayloadAction<Book[]>) => {
      state.theNewest = action.payload;
    },
    setTheBestRated: (state, action: PayloadAction<Book[]>) => {
      state.theBestRated = action.payload;
    },
    setTheMostPurchased: (state, action: PayloadAction<Book[]>) => {
      state.theMostPurchased = action.payload;
    },
    setAllBooks: (state, action: PayloadAction<Book[]>) => {
      state.FullList = action.payload;
    }
  }
});
export const { setTheNewest, setTheBestRated, setTheMostPurchased, setAllBooks } =
  booksSlice.actions;
export const selectTheNewestBooksList = (state: RootState) => state.booksList.theNewest;
export const selectTheBestRatedBooksList = (state: RootState) => state.booksList.theBestRated;
export const selectTheMostPurchasedBooksList = (state: RootState) =>
  state.booksList.theMostPurchased;
export const selectFullBooksList = (state: RootState) => state.booksList.FullList;
export default booksSlice.reducer;
