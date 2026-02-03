import { createContext, ReactNode, useEffect, useState } from 'react';

type StoreContextType = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

const defaultValue: StoreContextType = {
  inputValue: '',
  setInputValue: () => {}
};

export const StoreContext = createContext<StoreContextType>(defaultValue);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [inputValue, setInputValue] = useState(() => localStorage.getItem('storeInput') || '');

  useEffect(() => {
    localStorage.setItem('storeInput', inputValue);
  }, [inputValue]);
  return (
    <StoreContext.Provider value={{ inputValue, setInputValue }}>{children}</StoreContext.Provider>
  );
};
