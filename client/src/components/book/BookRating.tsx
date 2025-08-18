import { CheckIcon, StarIcon } from '@chakra-ui/icons';
import { HStack, Icon, IconButton, VStack, Text, useDisclosure } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserData } from '../../reducers/authSlice';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { Book } from '../../model/Book.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { useToastHandler } from '../../hooks/useToastHandler';
import BookDetails from '../../pages/BookDetails';
import BookItem from './BookItem';
import ConfirmationModal from '../modals/ConfirmationModal';

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
  const rateBookApi = useApi<ApiResponse<Book>>();

  const userDataId = useSelector(selectUserData)._id;
  const token = useSelector(selectAuthToken);
  const [numberOfStars, setNumberOfStars] = useState<number>(currentRating - 1);
  const [hoveredRatingIndex, setHoveredRatingIndex] = useState<number>(currentRating - 1);
  const [currentBookRating, setCurrentBookRating] = useState<number>(currentRating);
  const [ratingInModal, setRatingInModal] = useState<number>(0);
  const toast = useToastHandler();
  const [isRated, setIsRated] = useState<boolean>(false);
  const isBookDetails = calledInComponent.displayName === 'BookDetails';
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const isAlreadyRated = ratedBy?.some((userId) => userDataId === userId) ?? false;

  const rateBook = async () => {
    try {
      const response = await rateBookApi({
        method: 'POST',
        url: bookId && API_ROUTES.rateBook(bookId),
        data: {
          rating: ratingInModal
        }
      });

      if (response && response.status === 200) {
        const currentRating = response && response.data.data.currentRating;
        setNumberOfStars(currentRating - 1);
        setCurrentBookRating(currentRating);
        setHoveredRatingIndex(currentRating - 1);
        setIsRated(true);
        onModalClose();
        toast(
          `You've successfully sent ${ratingInModal} ${ratingInModal === 1 ? 'star' : 'stars'} rating`,
          'success'
        );
        setTimeout(() => {
          toast(
            `The avarage rating has been updated to ${Number(currentRating).toFixed(2)} ${currentRating === 1 ? 'star' : 'stars'}`,
            'success'
          );
        }, 2000);
      } else {
        toast(`${response && response?.data.message}`, 'error');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsRated(isAlreadyRated);
  }, [isAlreadyRated]);

  return (
    <>
      <VStack alignItems={'start'}>
        <HStack spacing={1}>
          {Array(5)
            .fill('')
            .map((_, i) => (
              <IconButton
                key={i}
                cursor={
                  isAlreadyRated || isRated || !token || !isBookDetails ? 'default' : 'pointer'
                }
                _disabled={{ backgroundColor: 'transparent' }}
                _hover={{ backgroundColor: 'transparent' }}
                backgroundColor={'transparent'}
                isDisabled={isAlreadyRated || isRated || !token}
                aria-label="star"
                icon={<StarIcon boxSize={7} />}
                onClick={
                  isBookDetails
                    ? async () => {
                        onModalOpen();
                      }
                    : undefined
                }
                onMouseEnter={
                  !isAlreadyRated && !isRated && token && isBookDetails
                    ? () => {
                        setHoveredRatingIndex(i);
                        setRatingInModal(i + 1);
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
      <ConfirmationModal
        isModalOpen={isModalOpen}
        onClose={onModalClose}
        headerText="Rate this Book?"
        bodyContent={
          <Text>{`Are you sure you want to give this book a ${ratingInModal}-star rating? You won't be able to change your rating later.`}</Text>
        }
        onCloseBtnText="Cancel"
        onConfirmBtnText="Confirm"
        onConfirm={rateBook}></ConfirmationModal>
    </>
  );
};

export default BookRating;
