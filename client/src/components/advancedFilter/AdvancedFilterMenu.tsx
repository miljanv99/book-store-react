import { Menu, MenuButton, Button, Portal, MenuList, MenuItem } from '@chakra-ui/react';
import { COLORS } from '../../globalColors';
import { FC } from 'react';
import { SetURLSearchParams } from 'react-router-dom';

type BaseSearchUrlParams = {
  key: string;
  value: string | object;
};

type ObjectSearchUrlParams = BaseSearchUrlParams & {
  value: object;
  stringify: true;
};

type StringSearchUrlParams = BaseSearchUrlParams & {
  value: string;
  stringify?: false;
};

type SearchUrlParams = ObjectSearchUrlParams | StringSearchUrlParams;

type SortOption = {
  label: string;
  value: Record<string, number>; // e.g. { price: 1 }
};

type FilterMenuProps = {
  label: string;
  paramKey: string;
  options?: SortOption[];
  allGenres?: string[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

const AdvancedFilterMenu: FC<FilterMenuProps> = ({ ...props }) => {
  const currentValue = props.searchParams.get(props.paramKey);
  let parsedValue: Record<string, number> | null = null;

  if (props.paramKey === 'sort') {
    parsedValue = currentValue ? JSON.parse(currentValue) : null;
  }

  const isActive = parsedValue && Object.keys(parsedValue)[0] in (props.options?.[0].value ?? {});

  const handleSearchUrlParams = (searchParams: SearchUrlParams) => {
    console.log('STRINGIFY: ', searchParams.stringify);
    const finalValue = searchParams.stringify
      ? JSON.stringify(searchParams.value)
      : String(searchParams.value);

    props.setSearchParams((prev) => {
      const prevParams = new URLSearchParams(prev);
      prevParams.set(searchParams.key, finalValue);
      return prevParams;
    });
  };

  if (props.paramKey === 'genre' && props.allGenres) {
    return (
      <Menu>
        <MenuButton
          _hover={{ color: props.searchParams.has('genre') && 'white' }}
          backgroundColor={props.searchParams.has('genre') ? COLORS.primaryColor : 'transparent'}
          color={props.searchParams.has('genre') ? 'black' : 'white'}
          onClick={() => {}}
          as={Button}
          variant="outline"
          size="sm">
          Genre
        </MenuButton>
        <Portal>
          <MenuList>
            {props.allGenres.map((genre) => (
              <MenuItem
                key={genre}
                backgroundColor={
                  props.searchParams.get('genre') === genre ? COLORS.primaryColor : 'transparent'
                }
                color={props.searchParams.get('genre') === genre ? 'black' : 'white'}
                onClick={() => {
                  handleSearchUrlParams({ key: 'genre', value: genre });
                }}>
                {genre}
              </MenuItem>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuButton
        _hover={{ color: isActive ? 'white' : undefined }}
        backgroundColor={isActive ? COLORS.primaryColor : 'transparent'}
        color={isActive ? 'black' : 'white'}
        as={Button}
        variant="outline"
        size="sm">
        {props.label}
      </MenuButton>
      <Portal>
        <MenuList>
          {props.options?.map((option, index) => {
            return (
              <MenuItem
                key={`${option}_${index}`}
                bg={
                  currentValue === JSON.stringify(option.value)
                    ? COLORS.primaryColor
                    : 'transparent'
                }
                color={currentValue === JSON.stringify(option.value) ? 'black' : 'white'}
                onClick={() => {
                  console.log('paramValue: ', option.value);

                  handleSearchUrlParams({
                    key: props.paramKey,
                    value: option.value,
                    stringify: true
                  });
                }}>
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default AdvancedFilterMenu;
