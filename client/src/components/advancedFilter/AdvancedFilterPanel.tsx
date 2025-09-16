import { VStack, HStack, Button, Text } from '@chakra-ui/react';
import { buttonStyles } from '../../globalStyles';
import { SetURLSearchParams } from 'react-router-dom';
import { FC } from 'react';
import AdvancedFilterMenu from './AdvancedFilterMenu';

interface AdvancedFilterPanelProps {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  allGenres: string[];
}

const AdvancedFilterPanel: FC<AdvancedFilterPanelProps> = ({
  searchParams,
  setSearchParams,
  allGenres
}) => {
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
          setSearchParams={setSearchParams}></AdvancedFilterMenu>

        {/* Sort by Rating */}
        <AdvancedFilterMenu
          label="Sort by Rating"
          paramKey="sort"
          options={[
            { label: 'Lower ↓ To Higher ↑', value: { currentRating: 1 } },
            { label: 'Higher ↑ To Lower ↓', value: { currentRating: -1 } }
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}></AdvancedFilterMenu>

        {/* Popularity */}
        <AdvancedFilterMenu
          label="Sort by Popularity"
          paramKey="sort"
          options={[
            { label: 'Lower ↓ To Higher ↑', value: { purchasesCount: 1 } },
            { label: 'Higher ↑ To Lower ↓', value: { purchasesCount: -1 } }
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}></AdvancedFilterMenu>

        {/* Title */}
        <AdvancedFilterMenu
          label="Sort by Title"
          paramKey="sort"
          options={[
            { label: 'A to Z', value: { title: 1 } },
            { label: 'Z to A', value: { title: -1 } }
          ]}
          searchParams={searchParams}
          setSearchParams={setSearchParams}></AdvancedFilterMenu>

        {/* Genre */}
        <AdvancedFilterMenu
          label="Genre"
          paramKey="genre"
          allGenres={allGenres}
          searchParams={searchParams}
          setSearchParams={setSearchParams}></AdvancedFilterMenu>

        {searchParams.size > 0 && (
          <Button
            {...buttonStyles}
            onClick={() => {
              setSearchParams({});
            }}>
            Clear filter
          </Button>
        )}
      </HStack>
    </VStack>
  );
};
export default AdvancedFilterPanel;
