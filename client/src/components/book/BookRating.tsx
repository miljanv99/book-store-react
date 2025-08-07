import { CheckIcon, StarIcon } from '@chakra-ui/icons';
import { HStack, Icon, IconButton, VStack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../../reducers/authSlice';
import { useMemo, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { Book } from '../../model/Book.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { useToastHandler } from '../../hooks/useToastHandler';
import BookDetails from '../../pages/BookDetails';
import BookItem from './BookItem';

interface BookRatingProps {
  currentRating: number;
  calledInComponent: typeof BookItem | typeof BookDetails;
  bookId?: string;
  ratedBy?: string[];
  size?: number;
}

const BookRating: React.FC<BookRatingProps> = ({
  currentRating,
  calledInComponent,
  bookId,
  ratedBy,
  size
}) => {
  const rateBook = useApi<ApiResponse<Book>>();

  const userDataId = useSelector(selectUserData).id;
  const token = useSelector(selectAuthToken);
  const [numberOfStars, setNumberOfStars] = useState<number>(currentRating - 1);
  const [hoveredRatingIndex, setHoveredRatingIndex] = useState<number>(currentRating - 1);
  const [currentBookRating, setCurrentBookRating] = useState<number>(currentRating);
  const toast = useToastHandler();
  const [isRated, setIsRated] = useState<boolean>(false);
  const isBookDetails = calledInComponent.displayName === 'BookDetails';

  const isAlreadyRated = useMemo(() => {
    if (ratedBy) {
      setIsRated(ratedBy.some((userId) => userDataId === userId));
      return ratedBy.some((userId) => userDataId === userId);
    }
  }, [userDataId]);

  return (
    <VStack alignItems={'start'}>
      <HStack spacing={1}>
        {Array(5)
          .fill('')
          .map((_, i) => (
            <IconButton
              key={i}
              _disabled={{ backgroundColor: 'transparent' }}
              _hover={{ backgroundColor: 'transparent' }}
              backgroundColor={'transparent'}
              isDisabled={isAlreadyRated || isRated || !token}
              aria-label="star"
              as={StarIcon}
              boxSize={7}
              onClick={
                isBookDetails
                  ? async () => {
                      const rating = hoveredRatingIndex + 1;

                      const response = await rateBook({
                        method: 'POST',
                        url: bookId && API_ROUTES.rateBook(bookId),
                        headers: { Authorization: `Bearer ${token}` },
                        data: {
                          rating: rating
                        }
                      });
                      if (response?.status === 200) {
                        const currentRating = response.data.data.currentRating;
                        setNumberOfStars(currentRating - 1);
                        setCurrentBookRating(currentRating);
                        setIsRated(true);
                        toast(
                          `You've successfully sent ${rating} ${rating === 1 ? 'star' : 'stars'} rating`,
                          'success'
                        );
                        setTimeout(() => {
                          toast(
                            `The avarage rating has been updated to ${Number(currentRating).toFixed(2)} ${currentRating === 1 ? 'star' : 'stars'}`,
                            'success'
                          );
                        }, 2000);
                      }
                    }
                  : undefined
              }
              onMouseEnter={
                !isAlreadyRated && !isRated && token && isBookDetails
                  ? () => {
                      setHoveredRatingIndex(i);
                    }
                  : undefined
              }
              onMouseLeave={
                isBookDetails
                  ? () => {
                      setHoveredRatingIndex(numberOfStars);
                    }
                  : undefined
              }
              style={{
                color: i <= hoveredRatingIndex ? '#fcc203' : 'gray',
                width: `${size}px`,
                height: `${size}px`
              }}
            />
          ))}
        {(isAlreadyRated || isRated) && (
          <VStack spacing={0}>
            <Icon as={CheckIcon} color={'green'} boxSize={7}></Icon>
            <Text>Rated</Text>
          </VStack>
        )}
      </HStack>
      <Text>{Number(currentBookRating).toFixed(2)} rating</Text>
    </VStack>
  );
};

export default BookRating;
