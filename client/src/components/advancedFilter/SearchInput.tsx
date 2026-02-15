import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FC } from 'react';
import { FiFilter } from 'react-icons/fi';
import { SetURLSearchParams } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

type SearchInputProps = {
  inputValue: string;
  inputValueTemperary: string;
  showAdvancedFilters: boolean;
  searchParams: URLSearchParams;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
  setInputValueTemperary: React.Dispatch<React.SetStateAction<string>>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchParams: SetURLSearchParams;
};

const SearchInput: FC<SearchInputProps> = ({
  inputValue,
  inputValueTemperary,
  searchParams,
  setShowAdvancedFilters,
  showAdvancedFilters,
  setInputValueTemperary,
  setInputValue,
  setSearchParams
}) => {
  const timeoutRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (timeoutRef.current) {
      console.log('TIMEOUT REF BEFORE: ', timeoutRef.current);
      timeoutRef.current -= timeoutRef.current;
      console.log('TIMEOUT REF: ', timeoutRef.current);
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setInputValueTemperary(value);
    }, 50);

    if (value === '') {
      setInputValue('');
      setSearchParams((prev) => {
        prev.delete('query');
        return prev;
      });
      localStorage.removeItem('storeInput');
    }
  };

  return (
    <InputGroup width={'500px'}>
      <Input
        width={500}
        defaultValue={inputValue}
        mb={showAdvancedFilters || searchParams.size > 0 ? 0 : 8}
        placeholder="Enter Title or Author"
        onChange={(e) => {
          handleChange(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setInputValue(inputValueTemperary);
          }
        }}></Input>
      <InputRightElement width={'auto'}>
        <>
          {(inputValue || inputValueTemperary.length != 0) && (
            <IconButton
              backgroundColor={'transparent'}
              aria-label="search_btn"
              icon={<MdSearch size={23} />}
              onClick={() => {
                setInputValue(inputValueTemperary);
              }}></IconButton>
          )}
          <IconButton
            backgroundColor={'transparent'}
            aria-label={'advanced_filter'}
            icon={<FiFilter />}
            isDisabled={searchParams.size > 2}
            onClick={() => {
              setShowAdvancedFilters((prev) => !prev);
            }}
            size="md"
          />
        </>
      </InputRightElement>
    </InputGroup>
  );
};

export default React.memo(SearchInput);
