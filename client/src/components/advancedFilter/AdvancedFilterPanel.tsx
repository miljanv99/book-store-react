import { VStack, HStack, Button, Text } from '@chakra-ui/react';
import { buttonStyles } from '../../globalStyles';
import { FC, useContext } from 'react';
import AdvancedFilterMenu from './AdvancedFilterMenu';
import React from 'react';
import { StoreContext } from '../../context/storeContext';

interface AdvancedFilterPanelProps {
  searchParams: URLSearchParams;
  updateSearchParams: (callback: (prev: URLSearchParams) => URLSearchParams) => void;
  setInputValueTemperary: React.Dispatch<React.SetStateAction<string>>;
  allGenres: string[];
}

const AdvancedFilterPanel: FC<AdvancedFilterPanelProps> = ({
  searchParams,
  updateSearchParams,
  setInputValueTemperary,
  allGenres
}) => {
  const inputValue = useContext(StoreContext);

  return (
    <VStack p={4} borderWidth={1} borderRadius="md" mb={'16px'}>
      <Text mb={2} fontWeight="bold">
        Advanced Filters
      </Text>
      <HStack spacing={4}>
        {/* Sort by Price */}
        <AdvancedFilterMenu
          label="Sort by Price"
          paramKey={'sort'}
          options={[
            { label: 'Lower ↓ To Higher ↑', value: { price: 1 } },
            { label: 'Higher ↑ To Lower ↓', value: { price: -1 } }
          ]}
          searchParams={searchParams}
          updateSearchParams={updateSearchParams}></AdvancedFilterMenu>

        {/* Sort by Rating */}
        <AdvancedFilterMenu
          label="Sort by Rating"
          paramKey="sort"
          options={[
            { label: 'Lower ↓ To Higher ↑', value: { currentRating: 1 } },
            { label: 'Higher ↑ To Lower ↓', value: { currentRating: -1 } }
          ]}
          searchParams={searchParams}
          updateSearchParams={updateSearchParams}></AdvancedFilterMenu>

        {/* Popularity */}
        <AdvancedFilterMenu
          label="Sort by Popularity"
          paramKey="sort"
          options={[
            { label: 'Lower ↓ To Higher ↑', value: { purchasesCount: 1 } },
            { label: 'Higher ↑ To Lower ↓', value: { purchasesCount: -1 } }
          ]}
          searchParams={searchParams}
          updateSearchParams={updateSearchParams}></AdvancedFilterMenu>

        {/* Title */}
        <AdvancedFilterMenu
          label="Sort by Title"
          paramKey="sort"
          options={[
            { label: 'A to Z', value: { title: 1 } },
            { label: 'Z to A', value: { title: -1 } }
          ]}
          searchParams={searchParams}
          updateSearchParams={updateSearchParams}></AdvancedFilterMenu>

        {/* Genre */}
        <AdvancedFilterMenu
          label="Genre"
          paramKey="genre"
          allGenres={allGenres}
          searchParams={searchParams}
          updateSearchParams={updateSearchParams}></AdvancedFilterMenu>

        {/* the size is 2, because url will always have 2 params: skip and limit */}
        {searchParams.size > 2 && (
          <Button
            {...buttonStyles}
            onClick={() => {
              updateSearchParams((prev) => {
                // Create a new URLSearchParams object
                const newParams = new URLSearchParams();

                // Keep only 'skip' and 'limit' if they exist
                ['skip', 'limit'].forEach((key) => {
                  const value = prev.get(key);
                  if (value !== null) {
                    newParams.set(key, value);
                  }
                });

                return newParams;
              });

              inputValue.setInputValue('');
              setInputValueTemperary('');
              localStorage.removeItem('storeInput');
            }}>
            Clear filter
          </Button>
        )}
      </HStack>
    </VStack>
  );
};
export default React.memo(AdvancedFilterPanel);
